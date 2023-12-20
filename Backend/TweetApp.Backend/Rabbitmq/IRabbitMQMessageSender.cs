namespace TweetApp.Backend.Rabbitmq
{
    public interface IRabbitMQMessageSender
    {
        void Publish(string message);
    }
}
