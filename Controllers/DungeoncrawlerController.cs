using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ErikHedakerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DungeoncrawlerController : Controller
    {
        private readonly IDungeoncrawlerProcessHandler _accessDPH;
        private readonly ILogger _logger;
        private readonly List<string> _testList;

        public DungeoncrawlerController(IDungeoncrawlerProcessHandler dungeoncrawlerPH, ILoggerFactory logFactory)
        {
            _accessDPH = dungeoncrawlerPH;
            _logger = logFactory.CreateLogger<DungeoncrawlerController>();
        }

        [HttpPost]
        public ActionResult<IEnumerable<string>> POST([FromBody]string id)
        {
            if (_accessDPH.Exist(id))
            {
                return Conflict();
            }

            _accessDPH.Add(id);

            Stopwatch sw = Stopwatch.StartNew();

            while (!_accessDPH.Active(id))
            {
                if (sw.ElapsedMilliseconds > 5000)
                {
                    return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                }

                Thread.Sleep(10);
            }

            return Ok(_accessDPH.Get(id));
        }

        [HttpDelete("{id}")]
        public ActionResult DELETE(string id)
        {
            if (!_accessDPH.Exist(id))
            {
                return NotFound();
            }

            _accessDPH.Remove(id);

            return NoContent();
        }

        [HttpPatch("{id}")]
        public ActionResult<IEnumerable<string>> PATCH(string id, [FromBody]string value)
        {
            if (!_accessDPH.Exist(id))
            {
                return NotFound();
            }

            _accessDPH.Update(id, value);

            //TODO: Change to something that actually works
            Thread.Sleep(15);

            return Ok(_accessDPH.Get(id));
        }

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<string>> GET(string id)
        {
            if (!_accessDPH.Exist(id))
            {
                return NotFound();
            }

            return Ok(_accessDPH.Get(id));
        }

        [Route("/Error")]
        public IActionResult Error() => Problem();
    }
}