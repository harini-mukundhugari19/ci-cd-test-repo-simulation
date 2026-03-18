import sys

def main():
    print("Starting process that will consume memory...", flush=True)
    memory_hog = []
    
    try:
        # Loop forever, appending large chunks of data to exhaust memory
        while True:
            # Append ~10MB string each iteration
            memory_hog.append("A" * 10_000_000)
    except MemoryError:
        print("Caught MemoryError (though usually the OS will kill it before this).", flush=True)
        sys.exit(137)

if __name__ == "__main__":
    main()
