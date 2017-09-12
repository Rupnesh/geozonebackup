/**
 * Profiler
 * Used to dump Memory and CPU information that can be used inside Chrome Developer Tools to track down memory & performance leaks
 *
 * Memory Usage:
 * Profiler.takeMemorySnapshot('myProfiling'); // will take an instant snapshot of the memory at the call time and will
 * dump the result into performance/memory/{myProfiling}_{date}.heapsnapshot
 *
 * CPU Trace Usage
 * Profiler.startCPUTrace('myCPUTrace');
 * // code you want to investigate here
 * Profiler.stopCPUTrace('myCPUTrace'); // will collect information about the CPU usage during execution of
 * that piece of code in between and will dump the data into performance/cpo/{myCPUTrace}_{date}.cpuprofile
 *
 * The upper files can be loaded in Chrome Dev Tools > Profiles > Record Javascript CPU Profile & Take a HEAP Snapshot
 * and click on Load then open the files dumped upper that you want to investigate
 * */
const fs = require('fs');
const path = require('path');
const profiler = require('v8-profiler');

const isProfiling = process.argv.indexOf('profiling') > 0;
export default {
  /**
   * Will take an instant memory snapshot
   * */
  takeMemorySnapshot(name) {
    if (!isProfiling) return;
    const snapshot = profiler.takeSnapshot(name);
    const heapFileName = path.join(__dirname, `../../performance/memory/${name}_${(new Date().toISOString())}.heapsnapshot`);

    console.log(snapshot.getHeader());
    snapshot.export((error, result) => {
      if (error) {
        console.error('ERROR == ', error);
      }
      fs.writeFile(heapFileName, result, { flag: 'wx' }, (err) => {
        if (err) throw err;
        snapshot.delete();
      });
    });
  },

  /**
   * Will start the CPU trace
   * */
  startCPUTrace(name) {
    if (!isProfiling) return;
    profiler.startProfiling(name, true);
  },
  /**
   * Will stop the CPU trace and will write the result to a file
   * */
  stopCPUTrace(name) {
    if (!isProfiling) return;
    const cpuProfile = profiler.stopProfiling();
    const cpuFileName = path.join(__dirname, `../../performance/cpu/${name}_${(new Date().toISOString())}.cpuprofile`);
    console.log(cpuProfile.getHeader());
    cpuProfile.export((error, result) => {
      if (error) {
        console.error('ERROR == ', error);
      }
      fs.writeFile(cpuFileName, result, { flag: 'wx' }, (err) => {
        if (err) throw err;
        cpuProfile.delete();
      });
    });
  }
};
