using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace ErikHedakerApp.Controllers
{
    [Route("api/Dungeoncrawler")]
    public class DungeoncrawlerController : Controller
    {
        private readonly IDungeoncrawlerProcessHandler _accessDPH;

        public DungeoncrawlerController(IDungeoncrawlerProcessHandler dungeoncrawlerPH)
        {
            _accessDPH = dungeoncrawlerPH;
        }

        // GET: api/<controller>
        [HttpGet]
        public DungeoncrawlerView Get()
        {
            return _accessDPH.Get();
        }

        /*
        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        */
    }
}