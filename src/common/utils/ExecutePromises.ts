type AsyncFunction<T> = () => Promise<T>;

export async function executePromises<T>(asyncFunctions: AsyncFunction<T>[]) {
    const promises = asyncFunctions.map(func => func());
          
    try {
        await Promise.all(promises);
    } catch (error) {
        console.error("Error:", error);
    }
}