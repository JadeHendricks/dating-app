namespace API.SignalR
{
    public class PresenceTracker
    {
        //a key value pair = username: list of connections (phone, desktop etc) keeps them online  in if they logged out of one
        private static readonly Dictionary<string, List<string>> OnlineUsers = 
            new Dictionary<string, List<string>>();

        //everytime a user connects they are given a new connectionId
        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;
            //lock prevents mulitple people from accessing this at the same time
            //everyone else connetion will simply have to wait there turn to be added to this, but it's minimal time really.
            lock(OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    //if they are already connected we add them to our dictionary
                    //this does not mean they are online, it means they've been online before
                    OnlineUsers[username].Add(connectionId);
                }
                else
                {
                    //if a new entry is added, that means the user is currently online
                    isOnline = true;
                    OnlineUsers.Add(username, new List<string>{connectionId});
                }
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;

            lock(OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                //remove users connectionId
                OnlineUsers[username].Remove(connectionId);

                //check if the connection ids are 0, if they are remove the username as well.
                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                    isOffline = true;
                }
            }
            return Task.FromResult(isOffline);
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

        public static Task<List<string>> GetConnectionForUsers(string username)
        {
            List<string> connectionIds;

            lock(OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(username);
            }

            return Task.FromResult(connectionIds);
        }
    }
}