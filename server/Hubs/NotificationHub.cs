using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Examhub.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        // Send notification to all users (except the admin who posted)
        public async Task SendNotification(string message)
        {
            _logger.LogInformation($"Broadcasting notification: {message}");
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}