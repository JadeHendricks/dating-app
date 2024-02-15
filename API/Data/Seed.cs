using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            //read from our json file
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            //if we've made a mistake with casing inside of our seed data
            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();

                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}