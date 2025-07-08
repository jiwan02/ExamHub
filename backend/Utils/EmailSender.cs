using MailKit.Net.Smtp;
using MimeKit;

namespace Examhub.Utils
{
    public static class EmailSender
    {
        private const string GmailUsername = "basant123bsnt@gmail.com";  // Replace with your Gmail
        private const string GmailPassword = "xujy zxak sadt kfsp";    // Use App Password (not Gmail password)

        public static async Task SendAsync(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Vacancy Notifier", GmailUsername));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body
            };

            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(GmailUsername, GmailPassword);
                await client.SendAsync(message);
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }
    }
}
