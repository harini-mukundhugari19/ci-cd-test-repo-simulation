import sys
import threading
import time

def main():
    print("Starting concurrent task processing...", flush=True)
    
    lock = threading.Lock()
    
    def process_data():
        lock.acquire()
        print("Thread acquired lock, doing work...", flush=True)
        time.sleep(1)
        # Attempting to acquire the same lock again without releasing it (Deadlock)
        print("Thread attempting to re-acquire lock...", flush=True)
        lock.acquire() 
        print("This will never print.", flush=True)

    t = threading.Thread(target=process_data)
    t.start()
    t.join()

if __name__ == "__main__":
    main()
