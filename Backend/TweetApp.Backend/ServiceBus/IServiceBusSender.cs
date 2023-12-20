namespace TweetApp.Backend.ServiceBus
{
    public interface IServiceBusSender
    {
        public Task SendMessageAsync(string log);
    }
}
