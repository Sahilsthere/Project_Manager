# Step 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.sln .
COPY MiniPM.API/*.csproj ./MiniPM.API/
RUN dotnet restore MiniPM.API/MiniPM.API.csproj

# Copy the rest of the files and build
COPY . .
WORKDIR /app/MiniPM.API
RUN dotnet publish -c Release -o /app/out

# Step 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Expose the port the API runs on
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "MiniPM.API.dll"]
