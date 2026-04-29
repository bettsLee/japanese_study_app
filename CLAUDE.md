# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Setup

This is a bare IntelliJ IDEA Kotlin project with no build tool (no Gradle or Maven). Dependencies are managed directly via IntelliJ's module system using `KotlinJavaRuntime`.

- Kotlin language version: 1.7
- JVM target: 1.8 (Java 8 bytecode)
- JDK: OpenJDK 22

## Source Layout

```
src/main/kotlin/      # production source
src/main/resources/   # production resources
src/test/kotlin/      # test source
src/test/resources/   # test resources
```

Compiled output goes to `out/` (IntelliJ default).

## Building and Running

Since there is no build script, compilation and execution are done through IntelliJ IDEA directly (Build menu or run configurations). There is no CLI build command.
