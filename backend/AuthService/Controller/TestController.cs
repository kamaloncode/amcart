using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult Public()
        {
            return Ok("Public endpoint");
        }

        [Authorize]
        [HttpGet("secure")]
        public IActionResult Secure()
        {
            return Ok("You are authenticated");
        }
    }
}