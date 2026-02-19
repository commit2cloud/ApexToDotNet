using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ApexToDotNet.API.Services
{
    public class OrdsApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OrdsApiClient> _logger;
        private readonly string _baseUrl;
        private readonly string _workspace;

        public OrdsApiClient(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<OrdsApiClient> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;

            _baseUrl = configuration["ApexSettings:OrdsBaseUrl"] 
                ?? "https://g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com/ords";
            _workspace = configuration["ApexSettings:WorkspaceName"] ?? "apexdotnet";

            // Configure authentication
            var username = configuration["ApexSettings:Username"] ?? "apexdotnet";
            var password = configuration["ApexSettings:Password"] ?? "";
            
            if (!string.IsNullOrEmpty(password))
            {
                var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}"));
                _httpClient.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Basic", authValue);
            }

            _httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<T?> GetAsync<T>(string endpoint)
        {
            try
            {
                var url = $"{_baseUrl}/{_workspace}/{endpoint}";
                _logger.LogInformation("GET request to {Url}", url);

                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("ORDS request failed: {StatusCode} - {Reason}", 
                        response.StatusCode, response.ReasonPhrase);
                    return default;
                }

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling ORDS endpoint: {Endpoint}", endpoint);
                throw;
            }
        }

        public async Task<T?> PostAsync<T>(string endpoint, object data)
        {
            try
            {
                var url = $"{_baseUrl}/{_workspace}/{endpoint}";
                _logger.LogInformation("POST request to {Url}", url);

                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("ORDS POST request failed: {StatusCode} - {Reason}", 
                        response.StatusCode, response.ReasonPhrase);
                    return default;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting to ORDS endpoint: {Endpoint}", endpoint);
                throw;
            }
        }

        public async Task<T?> PutAsync<T>(string endpoint, object data)
        {
            try
            {
                var url = $"{_baseUrl}/{_workspace}/{endpoint}";
                _logger.LogInformation("PUT request to {Url}", url);

                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PutAsync(url, content);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("ORDS PUT request failed: {StatusCode} - {Reason}", 
                        response.StatusCode, response.ReasonPhrase);
                    return default;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error putting to ORDS endpoint: {Endpoint}", endpoint);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(string endpoint)
        {
            try
            {
                var url = $"{_baseUrl}/{_workspace}/{endpoint}";
                _logger.LogInformation("DELETE request to {Url}", url);

                var response = await _httpClient.DeleteAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("ORDS DELETE request failed: {StatusCode} - {Reason}", 
                        response.StatusCode, response.ReasonPhrase);
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting ORDS endpoint: {Endpoint}", endpoint);
                throw;
            }
        }

        public async Task<string> GetRawAsync(string endpoint)
        {
            try
            {
                var url = $"{_baseUrl}/{_workspace}/{endpoint}";
                _logger.LogInformation("GET raw request to {Url}", url);

                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("ORDS request failed: {StatusCode} - {Reason}", 
                        response.StatusCode, response.ReasonPhrase);
                    return string.Empty;
                }

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling ORDS endpoint: {Endpoint}", endpoint);
                throw;
            }
        }
    }
}
