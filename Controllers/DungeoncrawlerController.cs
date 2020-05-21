using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ErikHedakerApp.Controllers
{
    [Route("api/Dungeoncrawler")]
    public class DungeoncrawlerController : Controller
    {
        private readonly IDungeoncrawlerProcessHandler _dungeoncrawlerPH;

        public DungeoncrawlerController(IDungeoncrawlerProcessHandler dungeoncrawlerPH)
        {
            _dungeoncrawlerPH = dungeoncrawlerPH;
        }

        // GET: api/<controller>
        [HttpGet]
        public DungeoncrawlerView Get()
        {
            return _dungeoncrawlerPH.Get();
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