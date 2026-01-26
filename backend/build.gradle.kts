import java.io.BufferedReader

import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    java
    id("org.springframework.boot") version "3.3.3"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "cz.scrumdojo"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.apache.commons:commons-lang3")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

fun featureFlag(): Boolean {
    return System.getenv("FEATURE_FLAG")?.toBoolean() ?: false
}

sourceSets {
    main {
        resources {
            if (!featureFlag()) exclude("feature-flag.properties")
        }
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
    jvmArgs("-XX:+EnableDynamicAgentLoading")
}

fun jarFile(): String {
    return tasks.named<BootJar>("bootJar").get().archiveFile.get().asFile.relativeTo(projectDir).path
}

tasks.register<Exec>("buildDockerImage") {
    dependsOn("bootJar")
    val jarFile = jarFile().replace("\\", "/")
    commandLine("docker", "build", "--build-arg", "JAR_FILE=$jarFile", "-t", "quizmaster:latest", ".")
}
