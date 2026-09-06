FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["IstropAviary.API.csproj", "./"]
RUN dotnet restore "IstropAviary.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "IstropAviary.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "IstropAviary.API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80/8080 (Render expects 10000 or reads the PORT env var)
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "IstropAviary.API.dll"]
