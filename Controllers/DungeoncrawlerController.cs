using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ErikHedakerApp.Controllers
{
    [ApiController]
    [Route( "api/[controller]" )]
    public class DungeoncrawlerController : Controller
    {
        private readonly IDungeoncrawlerProcessHandler _accessDPH;

        public DungeoncrawlerController( IDungeoncrawlerProcessHandler dungeoncrawlerPH )
        {
            _accessDPH = dungeoncrawlerPH;
        }

        [HttpPost]
        public ActionResult<IEnumerable<string>> POST( [FromBody] string id )
        {
            Stopwatch stopwatch = Stopwatch.StartNew( );

            if( _accessDPH.Exist( id ) )
            {
                return Conflict( );
            }

            _accessDPH.Add( id );

            while( !_accessDPH.Active( id ) )
            {
                if( stopwatch.ElapsedMilliseconds > 5000 )
                {
                    throw new ProcessUnresponsiveException( "Process is unresposive" );
                }

                Thread.Sleep( 10 );
            }

            return Ok( _accessDPH.Get( id ) );
        }

        [HttpDelete( "{id}" )]
        public ActionResult DELETE( string id )
        {
            if( !_accessDPH.Exist( id ) )
            {
                return NotFound( );
            }

            _accessDPH.Remove( id );

            return NoContent( );
        }

        [HttpPatch( "{id}" )]
        public ActionResult<IEnumerable<string>> PATCH( string id, [FromBody] string value )
        {
            if( !_accessDPH.Exist( id ) )
            {
                return NotFound( );
            }

            _accessDPH.Update( id, value );

            // Process needs time to fetch from input stream, calculate and write to output stream
            // TODO: Change to something that works logically
            Thread.Sleep( 25 );

            return Ok( _accessDPH.Get( id ) );
        }

        [HttpGet( "{id}" )]
        public ActionResult<IEnumerable<string>> GET( string id )
        {
            if( !_accessDPH.Exist( id ) )
            {
                return NotFound( );
            }

            return Ok( _accessDPH.Get( id ) );
        }
    }
}

namespace ErikHedakerApp
{
    [Serializable]
    public class ProcessUnresponsiveException : Exception
    {
        public ProcessUnresponsiveException( ) { }
        public ProcessUnresponsiveException( string message ) : base( message ) { }
        public ProcessUnresponsiveException( string message, Exception inner ) : base( message, inner ) { }
        protected ProcessUnresponsiveException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context ) : base( info, context ) { }
    }
}