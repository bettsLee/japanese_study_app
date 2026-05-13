package com.jp5.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import java.math.BigInteger;
import java.net.URL;
import java.security.AlgorithmParameters;
import java.security.KeyFactory;
import java.security.interfaces.ECPublicKey;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.ECParameterSpec;
import java.security.spec.ECPoint;
import java.security.spec.ECPublicKeySpec;
import java.util.Base64;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/health",
                    "/api/v1/check",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${supabase.jwks-uri}") String jwksUri) {
        // JWKS fetch를 첫 요청 시점으로 지연
        return new LazyEcJwtDecoder(jwksUri);
    }

    private static class LazyEcJwtDecoder implements JwtDecoder {
        private final String jwksUri;
        private volatile JwtDecoder delegate;

        LazyEcJwtDecoder(String jwksUri) {
            this.jwksUri = jwksUri;
        }

        @Override
        public Jwt decode(String token) throws JwtException {
            if (delegate == null) {
                synchronized (this) {
                    if (delegate == null) {
                        delegate = buildDecoder();
                    }
                }
            }
            return delegate.decode(token);
        }

        private JwtDecoder buildDecoder() {
            try {
                JsonNode key = new ObjectMapper()
                    .readTree(new URL(jwksUri))
                    .get("keys").get(0);

                byte[] x = Base64.getUrlDecoder().decode(key.get("x").asText());
                byte[] y = Base64.getUrlDecoder().decode(key.get("y").asText());

                AlgorithmParameters params = AlgorithmParameters.getInstance("EC");
                params.init(new ECGenParameterSpec("secp256r1"));
                ECParameterSpec ecSpec = params.getParameterSpec(ECParameterSpec.class);

                ECPublicKey ecPublicKey = (ECPublicKey) KeyFactory.getInstance("EC")
                    .generatePublic(new ECPublicKeySpec(
                        new ECPoint(new BigInteger(1, x), new BigInteger(1, y)), ecSpec));

                ECKey cleanKey = new ECKey.Builder(Curve.P_256, ecPublicKey)
                    .keyID(key.get("kid").asText())
                    .build();

                DefaultJWTProcessor<SecurityContext> processor = new DefaultJWTProcessor<>();
                processor.setJWSKeySelector(new JWSVerificationKeySelector<>(
                    JWSAlgorithm.ES256, new ImmutableJWKSet<>(new JWKSet(cleanKey))));

                return new NimbusJwtDecoder(processor);
            } catch (Exception e) {
                throw new JwtException("JWKS 로드 실패: " + e.getMessage(), e);
            }
        }
    }
}
