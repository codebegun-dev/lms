# ---- Build stage (Maven + JDK 21) ----
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -B -DskipTests clean package

# ---- Runtime stage (JRE 21) ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","/app/app.jar"]
