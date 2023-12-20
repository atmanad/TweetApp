namespace TweetApp.Backend.Rabbitmq
{
    public class RabbitMQMessageSender : IRabbitMQMessageSender
    {
        public void Publish(string message)
        {
            //var factory = new ConnectionFactory()
            //{
            //    Uri = new Uri("amqp://guest:guest@localhost:5672")
            //};

            //using var connection = factory.CreateConnection();
            //using var channel = connection.CreateModel();

            //channel.QueueDeclare("tweet-queue",
            //    durable: true, exclusive: false, autoDelete: false, arguments: null);

            //channel.ExchangeDeclare("logs", "fanout");

            //var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));
            //channel.BasicPublish("logs", "tweet-queue", null, body);
        }
    }
}
