using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Runtime.InteropServices;

namespace ErikHedakerApp
{
    public class DungeoncrawlerProcess
    {
        private bool transmitted;
        private Process process;
        private List<string> output;
        private StreamWriter inputStream;
        private Stopwatch stopwatch;

        public DungeoncrawlerProcess()
        {
            stopwatch = Stopwatch.StartNew();
            transmitted = false;
            process = new Process();
            output = new List<string>();
            process.StartInfo.FileName = RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "Dungeoncrawler.exe" : "Dungeoncrawler.out";
            process.StartInfo.Arguments = "noclear nosave noexit noconfig";
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardInput = true;
            process.OutputDataReceived += (sender, e) =>
            {
                if (transmitted)
                {
                    transmitted = false;
                    output.Clear();
                }

                output.Add(e.Data);
            };
            process.Start();
            inputStream = process.StandardInput;
            process.BeginOutputReadLine();
        }

        ~DungeoncrawlerProcess()
        {
            process.Kill();
            process.WaitForExit();
        }
        
        public bool Idle(long threshold)
        {
            return stopwatch.ElapsedMilliseconds > threshold;
        }

        public bool Active( )
        {
            return !process.HasExited && output.Count > 0;
        }

        public bool Changed( )
        {
            return Active() && !transmitted;
        }

        public void Update( string value )
        {
            inputStream.WriteLine(value);
            stopwatch.Restart();
        }

        public List<string> Get()
        {
            transmitted = true;
            return output;
        }
    }

    public class DungeoncrawlerProcessHandler : IDungeoncrawlerProcessHandler
    {
        private Dictionary<string, DungeoncrawlerProcess> _processes;
        private readonly long _thresholdIdle;
        private readonly long _timerRepeat;
        private readonly Timer _timer;

        public DungeoncrawlerProcessHandler()
        {
            _processes = new Dictionary<string, DungeoncrawlerProcess>();
            _thresholdIdle = 60000;
            _timerRepeat = 10000;
            _timer = new Timer(KillIdleProcesses, null, _timerRepeat, _timerRepeat);
        }

        public void KillIdleProcesses(object state)
        {
            List<string> removes = new List<string>();

            foreach ( var pair in _processes)
            {
                if( pair.Value.Idle(_thresholdIdle) )
                {
                    removes.Add(pair.Key);
                }
            }

            foreach(var id in removes)
            {
                _processes.Remove(id);
                Console.WriteLine("IDLE KILL: " + id);
            }
        }

        public bool Exist(string id)
        {
            return _processes.ContainsKey(id);
        }

        public bool Active( string id )
        {
            return _processes[id].Active();
        }

        public bool Changed(string id)
        {
            return _processes[id].Changed();
        }

        public void Add(string id)
        {
            _processes.Add(id, new DungeoncrawlerProcess());
        }

        public void Remove(string id)
        {
            _processes.Remove(id);
        }

        public void Update( string id, string value )
        {
            _processes[id].Update( value );
        }

        public List<string> Get(string id)
        {
            return _processes[id].Get();
        }
    }

    public interface IDungeoncrawlerProcessHandler
    {
        public bool Exist(string id);
        public bool Active(string id);
        public bool Changed(string id);
        public void Add(string id);
        public void Remove(string id);
        public void Update(string id, string value);
        public List<string> Get(string id);
    }
}