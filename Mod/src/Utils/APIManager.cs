using BepInEx.Logging;
using System.Net.Http;
using System.Threading.Tasks;

namespace WalkieTalkieChannels.Utils.APIManager
{
    internal class APIManager
    {
        private static readonly HttpClient client = new HttpClient();

        // A method to send a GET request to the API
        public async Task<string> GetAsync(string url)
        {
            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            return responseBody;
        }

        // A method to send a POST request to the API
        public async Task<string> PostAsync(string url, HttpContent content)
        {
            HttpResponseMessage response = await client.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            WalkieTalkieChannels._Instance.logger.LogInfo("POST request sent to API! Responce is " + response);
            return responseBody;
        }
    }
}