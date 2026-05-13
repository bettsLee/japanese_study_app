package com.jp5.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;

@Component
public class JwtDebugFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtDebugFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                String token = auth.substring(7);
                String headerB64 = token.split("\\.")[0];
                String header = new String(Base64.getUrlDecoder().decode(headerB64));
                log.info("[JWT-DEBUG] header={}", header);
            } catch (Exception e) {
                log.warn("[JWT-DEBUG] header parse failed: {}", e.getMessage());
            }
        }
        chain.doFilter(request, response);
    }
}
