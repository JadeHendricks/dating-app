namespace API.SignalR
{
    public class PresenceTracker
    {
        //a key value pair = username: list of connections (phone, desktop etc) keeps them online  in if they logged out of one
        private static readonly Dictionary<string, List<string>> OnlineUsers = 
            new Dictionary<string, List<string>>();

        //everytime a user connects they are given a new connectionId
        public Task UserConnected(string username, string connectionId)
        {
            //lock prevents mulitple people from accessing this at the same time
            //everyone else connetion will simply have to wait there turn to be added to this, but it's minimal time really.
            lock(OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    //if they are already connected we add them to our dictionary
                    OnlineUsers[username].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(username, new List<string>{connectionId});
                }
            }
            return Task.CompletedTask;
        }

        public Task UserDisconnected(string username, string connectionId)
        {
            lock(OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.CompletedTask;

                //remove users connectionId
                OnlineUsers[username].Remove(connectionId);

                //check if the connection ids are 0, if they are remove the username as well.
                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                }
            }
            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;

            lock(OnlineUsers)
            {
                //order the results via the key and only return the key
                onlineUsers = OnlineUsers
                    .OrderBy(k => k.Key)
                    .Select(k => k.Key)
                    .ToArray();
            }

            return Task.FromResult(onlineUsers);
        }
    }
}