using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
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
        public ActionResult<string> POST( )
        {
            Stopwatch stopwatch = Stopwatch.StartNew( );
            string uuid = Utility.GetUniqueID( 16 );

            if( _accessDPH.Exist( uuid ) )
            {
                return Conflict( );
            }

            _accessDPH.Add( uuid );

            while( !_accessDPH.Active( uuid ) )
            {
                if( stopwatch.ElapsedMilliseconds > 5000 )
                {
                    throw new ProcessUnresponsiveException( "Process is unresposive" );
                }

                Thread.Sleep( 10 );
            }

            return Ok( new { output = _accessDPH.Get( uuid ), id = uuid } );
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
            Thread.Sleep( 15 );

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

    public static class Utility
    {
        public static string GetUniqueID( int length )
        {
            StringBuilder builder = new StringBuilder( );
            Enumerable
                .Range( 65, 26 )
                .Select( e => ( (char)e ).ToString( ) )
                .Concat( Enumerable.Range( 97, 26 ).Select( e => ( (char)e ).ToString( ) ) )
                .Concat( Enumerable.Range( 0, 10 ).Select( e => e.ToString( ) ) )
                .OrderBy( e => Guid.NewGuid( ) )
                .Take( length )
                .ToList( ).ForEach( e => builder.Append( e ) );
            return builder.ToString( );
        }
    }
}