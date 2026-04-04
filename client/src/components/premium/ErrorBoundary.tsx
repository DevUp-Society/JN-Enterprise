import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SYSTEM_CRASH_REPORT:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#D6D6D6] flex flex-col items-center justify-center p-20 text-center font-mono select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#FFFFFF20_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          <div className="relative z-10 space-y-12 max-w-2xl w-full">
            <div className="flex justify-center">
               <div className="p-8 border-2 border-black rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <AlertTriangle size={64} className="text-black" />
               </div>
            </div>

            <div className="space-y-4">
              <Logo className="text-4xl opacity-20 mx-auto" />
              <h1 className="text-4xl font-black text-[#FFFFFF] tracking-titer uppercase italic leading-none">
                INDUSTRIAL_SYSTEM_<br />FAILURE_DETECTED
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/60">
                CRITICAL_CORE_PROCESS_TERMINATED // ERROR_CODE: 0x8842
              </p>
            </div>

            <div className="p-10 bg-white border border-[#FFFFFF]/10 shadow-2xl space-y-6 rounded-[32px]">
               <p className="text-[11px] font-black uppercase tracking-widest text-[#FFFFFF] opacity-40 leading-relaxed">
                  The system has encountered a non-recoverable rendering exception. 
                  Failsafe mechanisms have been engaged. Infrastructure remains secure.
               </p>
               <div className="h-[2px] w-full bg-[#FFFFFF]/10" />
               <button 
                 onClick={this.handleReload}
                 className="w-full h-16 bg-[#FFFFFF] text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#000000] transition-all shadow-lg flex items-center justify-center gap-6 group rounded-[16px]"
               >
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                  REBOOT_SYSTEM_PROTOCOL
               </button>
            </div>
            
            <p className="text-[8px] font-black uppercase tracking-widest-xl text-[#FFFFFF] opacity-20">
               JN_ENTERPRISE_FAILSAFE_CONSOLE v4.0.2 // STACK_TRACE_LOG_EMITTED
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;










