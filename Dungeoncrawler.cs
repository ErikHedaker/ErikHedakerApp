using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace ErikHedakerApp
{
    public class DungeoncrawlerProcess
    {
        private bool transmitted;
        private Process process;
        private List<string> output;
        private StreamWriter inputStream;

        public DungeoncrawlerProcess()
        {
            transmitted = false;
            process = new Process();
            output = new List<string>();
            process.StartInfo.FileName = @"C:\Users\Erik\source\repos\Dungeoncrawler\Release\Dungeoncrawler.exe";
            process.StartInfo.Arguments = "noclear nosave noexit";
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

        public DungeoncrawlerProcessHandler()
        {
            _processes = new Dictionary<string, DungeoncrawlerProcess>();
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