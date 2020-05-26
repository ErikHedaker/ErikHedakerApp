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

namespace ErikHedakerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DungeoncrawlerController : Controller
    {
        private readonly IDungeoncrawlerProcessHandler _accessDPH;

        public DungeoncrawlerController(IDungeoncrawlerProcessHandler dungeoncrawlerPH)
        {
            _accessDPH = dungeoncrawlerPH;
        }

        [HttpPost]
        public ActionResult<IEnumerable<string>> POST([FromBody]string id)
        {
            Console.Write("POST & ");
            if ( _accessDPH.Exist(id))
            {
                return Conflict();
            }

            _accessDPH.Add(id);
            Thread.Sleep(100);

            return GET(id);
        }

        [HttpDelete("{id}")]
        public ActionResult DELETE(string id)
        {
            Console.Write("DELETE: " + id + "\n");
            if( !_accessDPH.Exist(id) )
            {
                return NotFound();
            }

            _accessDPH.Remove(id);

            return NoContent();
        }

        //[HttpGet("{id}")]
        //public async ActionResult<IEnumerable<string>> AsyncGET(string id)
        //{
        //    if (!_accessDPH.Exist(id))
        //    {
        //        return NotFound();
        //    }

        //    try
        //    {
        //        await Utility.TimeoutAfter(Task.Run(async () =>
        //        {
        //            while (!_accessDPH.Active(id))
        //            {
        //                await Task.Delay(25);
        //            }

        //            return true;
        //        }), new TimeSpan(0, 0, 1));
        //    }
        //    catch(TimeoutException e)
        //    {
        //        return NotFound();
        //    }

        //    return Ok( _accessDPH.Get(id) );
        //}

        [HttpPatch("{id}")]
        public ActionResult<IEnumerable<string>> PATCH(string id, [FromBody]string value)
        {
            Console.Write("PATCH & ");
            if (!_accessDPH.Exist(id))
            {
                return NotFound();
            }

            _accessDPH.Update(id, value);

            //TODO: Change to something that actually works
            Thread.Sleep(50);

            return GET(id);
        }

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<string>> GET(string id)
        {
            Console.Write("GET: " + id + "\n");
            if (!_accessDPH.Exist(id))
            {
                return NotFound();
            }

            if (!Utility.DungeoncrawlerTimeout(_accessDPH.Active, id, 1000))
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            return Ok(_accessDPH.Get(id));
        }
    }

    static class Utility
    {
        public static bool DungeoncrawlerTimeout( Func<string, bool> check, string id, long timeout )
        {
            Stopwatch sw = new Stopwatch();

            sw.Start();

            while (true)
            {
                if (check(id))
                {
                    return true;
                }

                if (sw.ElapsedMilliseconds > timeout)
                {
                    return false;
                }

                Thread.Sleep(1);
            }
        }

        public static async Task<TResult> TimeoutAfter<TResult>(this Task<TResult> task, TimeSpan timeout)
        {
            using (var timeoutCancellationTokenSource = new CancellationTokenSource())
            {
                var completedTask = await Task.WhenAny(task, Task.Delay(timeout, timeoutCancellationTokenSource.Token));

                if (completedTask == task)
                {
                    timeoutCancellationTokenSource.Cancel();
                    return await task;
                }
                else
                {
                    throw new TimeoutException("The operation has timed out.");
                }
            }
        }
    }
}