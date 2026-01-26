FROM openjdk:21-jdk-slim
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} quizmaster.jar
EXPOSE 8080
CMD ["java", "-jar", "/quizmaster.jar"]
