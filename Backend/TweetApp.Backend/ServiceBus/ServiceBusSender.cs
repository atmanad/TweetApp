using Azure.Messaging.ServiceBus;
using System.Text.Json;

namespace TweetApp.Backend.ServiceBus
{
    public class ServiceBusSender : IServiceBusSender
    {
        public async Task SendMessageAsync(string log)
        {
            var connectionString = "Endpoint=sb://sb-tweet.servicebus.windows.net/;SharedAccessKeyName=managePolicy;SharedAccessKey=leJHMKb0B4HODreuS7b6P4hR8igxk3BSm9BwQ7mQmd4=;EntityPath=tweet-log";
            var client = new ServiceBusClient(connectionString);
            var sender = client.CreateSender("tweet-log");
            var body = JsonSerializer.Serialize(log);
            var message = new ServiceBusMessage(body);
            await sender.SendMessageAsync(message);
            await client.DisposeAsync();
            await sender.DisposeAsync();
        }

    }
}
