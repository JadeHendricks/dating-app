namespace API.Helpers
{
    public class PaginationParams
    {
        //allowing the user to chose how many items they want to see, but up to a limit
        private const int MaxPageSize = 50;
        public int PageNumber {get; set;} = 1;
        public int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}