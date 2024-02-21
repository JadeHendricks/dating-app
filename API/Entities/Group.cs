using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Group
    {
        //we need to create another construtor but empty to satisfy entity framework
        //when it creates a new instance of this connection it won't be expecting anything to be passed
        public Group()
        {
        }

        public Group(string name)
        {
            Name = name;
        }

        [Key]
        public string Name { get; set; }    
        public ICollection<Connection> Connections { get; set; } = new List<Connection>();
    }
}