using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ErikHedakerApp
{
    public interface IDungeoncrawlerProcessHandler
    {
        public DungeoncrawlerView Get();
        public void Post(string input);
    }

    public class DungeoncrawlerProcessHandler : IDungeoncrawlerProcessHandler
    {
        public Process process;
        public StreamWriter inputStream;
        public DungeoncrawlerView view;

        public DungeoncrawlerProcessHandler()
        {
            process = new Process();
            view = new DungeoncrawlerView();
            process.StartInfo.FileName = @"C:\Users\Erik\source\repos\Dungeoncrawler\Executable\Dungeoncrawler.exe";
            process.StartInfo.Arguments = "noclear";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardInput = true;
            process.OutputDataReceived += (sender, e) => view.output.Add(e.Data);
            process.Start();
            inputStream = process.StandardInput;
            process.BeginOutputReadLine();
        }

        //~DungeoncrawlerProcessHandler()
        //{
        //    process.WaitForExit(1000);
        //}

        public DungeoncrawlerView Get()
        {
            return view;
        }

        public void Post(string input)
        {
            inputStream.WriteLine(input);
        }
    }
}


namespace ErikHedakerApp
{
    public class DungeoncrawlerView
    {
        public List<string> output { get; set; }

        public DungeoncrawlerView()
        {
            output = new List<string>();
        }
    }
}