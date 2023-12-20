using Azure.Messaging.ServiceBus;
using System;
using System.Threading.Tasks;

namespace QueueReceiver
{
    class Program
    {
        // connection string to your Service Bus namespace
        static string connectionString = "Endpoint=sb://sb-tweet.servicebus.windows.net/;SharedAccessKeyName=managePolicy;SharedAccessKey=leJHMKb0B4HODreuS7b6P4hR8igxk3BSm9BwQ7mQmd4=;EntityPath=tweet-log";

        // name of your Service Bus queue
        static string queueName = "tweet-log";


        // the client that owns the connection and can be used to create senders and receivers
        static ServiceBusClient client;

        // the processor that reads and processes messages from the queue
        static ServiceBusProcessor processor;

        // handle received messages
        static async Task MessageHandler(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();
            Console.WriteLine($"Received: {body}");

            // complete the message. messages is deleted from the queue. 
            await args.CompleteMessageAsync(args.Message);
        }

        // handle any errors when receiving messages
        static Task ErrorHandler(ProcessErrorEventArgs args)
        {
            Console.WriteLine(args.Exception.ToString());
            return Task.CompletedTask;
        }

        static async Task Main()
        {


            var clientOptions = new ServiceBusClientOptions() { TransportType = ServiceBusTransportType.AmqpWebSockets };
            client = new ServiceBusClient(connectionString, clientOptions);

            // create a processor that we can use to process the messages
            processor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions());

            try
            {
                // add handler to process messages
                processor.ProcessMessageAsync += MessageHandler;

                // add handler to process any errors
                processor.ProcessErrorAsync += ErrorHandler;

                // start processing 
                await processor.StartProcessingAsync();

                Console.WriteLine("Message received in the queue will be displayed here");
                Console.ReadKey();

                // stop processing 
                Console.WriteLine("\nStopping the receiver...");
                await processor.StopProcessingAsync();
                Console.WriteLine("Stopped receiving messages");
            }
            finally
            {
                // Calling DisposeAsync on client types is required to ensure that network
                // resources and other unmanaged objects are properly cleaned up.
                await processor.DisposeAsync();
                await client.DisposeAsync();
            }
        }
    }
}