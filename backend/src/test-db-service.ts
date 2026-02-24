import { dbService } from './services/databaseService';

async function testDatabaseService() {
  try {
    console.log('🧪 Testing Database Service...\n');

    // Test 1: Create a user
    console.log('1. Creating user...');
    const user = await dbService.upsertUser('GABC123TESTWALLETADDRESS');
    console.log('✅ User created:', user.walletAddress);

    // Test 2: Create a group
    console.log('\n2. Creating group...');
    const group = await dbService.upsertGroup('test-group-1', {
      name: 'Test Savings Group',
      contributionAmount: BigInt(1000000),
      frequency: 7,
      maxMembers: 10,
    });
    console.log('✅ Group created:', group.name);

    // Test 3: Add member to group
    console.log('\n3. Adding member to group...');
    await dbService.addGroupMember('test-group-1', 'GABC123TESTWALLETADDRESS');
    console.log('✅ Member added to group');

    // Test 4: Add contribution
    console.log('\n4. Recording contribution...');
    const contribution = await dbService.addContribution({
      groupId: 'test-group-1',
      walletAddress: 'GABC123TESTWALLETADDRESS',
      amount: BigInt(1000000),
      round: 1,
      txHash: 'test-tx-hash-123',
    });
    console.log('✅ Contribution recorded:', contribution.txHash);

    // Test 5: Retrieve group with relations
    console.log('\n5. Retrieving group with members and contributions...');
    const fullGroup = await dbService.getGroup('test-group-1');
    console.log('✅ Group retrieved:');
    console.log('   - Name:', fullGroup?.name);
    console.log('   - Members:', fullGroup?.members.length);
    console.log('   - Contributions:', fullGroup?.contributions.length);

    // Test 6: Get all groups
    console.log('\n6. Getting all groups...');
    const allGroups = await dbService.getAllGroups();
    console.log('✅ Total groups:', allGroups.length);

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testDatabaseService();
