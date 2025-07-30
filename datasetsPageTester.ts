const apiUrl = 'https://api.dev.hdruk.cloud';
const webUrlBase = 'https://web.dev.hdruk.cloud/en/dataset';
const ALargeNumber = 10000;

const successfulIds: number[] = [];
const failedIds: number[] = [];

async function getDatasetIds(): Promise<number[]> {
  const url = `${apiUrl}/api/v2/datasets?with_metadata=false&per_page=${ALargeNumber}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch dataset list: ${response.status}`);
    }

    const json = await response.json();
    const ids = json.data.map((item: any) => item.id);
    return ids;
  } catch (error) {
    console.error('Error fetching dataset IDs:', error);
    return [];
  }
}

async function checkWebPage(id: number): Promise<void> {
  const url = `${webUrlBase}/${id}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      successfulIds.push(id);
    } else {
      failedIds.push(id);
    }
  } catch {
    failedIds.push(id);
  }
}

function logEstimatedTime(startTime: number, total: number) {
  const elapsed = (Date.now() - startTime) / 1000;
  const estimatedTotal = (elapsed / processedCount) * total;
  const remaining = estimatedTotal - elapsed;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.round(remaining % 60);
  console.log(`Estimated time remaining: ~${minutes}m ${seconds}s`);
}

let processedCount = 0;

async function main() {
  const ids = await getDatasetIds();
  const total = ids.length;

  if (total === 0) {
    console.error('No dataset IDs retrieved.');
    return;
  }

  console.log(`There be ${total} dataset pages to check...\n`);

  const startTime = Date.now();

  const progressInterval = setInterval(() => {
    console.log(`Still working... ${processedCount}/${total} done`);
    logEstimatedTime(startTime, total);
  }, 5000);

  const wrappedCheckWebPage = async (id: number) => {
    await checkWebPage(id);
    processedCount++;
  };

  await Promise.all(ids.map(wrappedCheckWebPage));

  clearInterval(progressInterval);

  console.log('\n=== Summary ===');
  console.log(`Successful: ${successfulIds.length}`);
  console.log(`Failed: ${failedIds.length}`);
  if (failedIds.length > 0) {
    console.log(`Failed IDs: ${failedIds}`);
  }
}

main();
