namespace API.Entities
{
    public class Connection
    {
        //we need to create another construtor but empty to satisfy entity framework
        //when it creates a new instance of this connection it won't be expecting anything to be passed
        public Connection()
        {
        }

        public Connection(string connectionId, string username)
        {
            ConnectionId = connectionId;
            Username = username;
        }

        public string ConnectionId { get; set; }
        public string Username { get; set; }
    }
}