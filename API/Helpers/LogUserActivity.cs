using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //resultContext == ActionExecutedContext that means that the api action is completed and we'll get the result context back from this
            //if you want to do something vefore this action we can use ActionExecutingContext
            var resultContext = await next();
            
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var unitOfWork = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
            var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;

            await unitOfWork.Complete();
        }
    }
}