// public/js/household-investment-manager.js
// Make sure Firebase is initialized before this script runs.
// const db = firebase.firestore(); // Usually initialized in a firebase.js or similar. Functions below get it per call.

/**
 * Adds a new investment to a specific household.
 * @param {string} householdId - The ID of the household.
 * @param {object} investmentData - The investment data to add.
 * @returns {Promise<string>} The ID of the newly created investment.
 */
async function addHouseholdInvestment(householdId, investmentData) {
  if (!householdId) throw new Error("Household ID is required.");
  if (!firebase.auth().currentUser) throw new Error("User not authenticated.");

  const db = firebase.firestore();
  const dataToAdd = {
    ...investmentData,
    user_id: firebase.auth().currentUser.uid, // UID of the user creating the investment
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const investmentRef = await db.collection('households').doc(householdId)
                                  .collection('investments').add(dataToAdd);
  return investmentRef.id;
}

/**
 * Fetches all investments for a specific household.
 * @param {string} householdId - The ID of the household.
 * @returns {Promise<Array<object>>} An array of investment objects, each with its ID.
 */
async function getHouseholdInvestments(householdId) {
  if (!householdId) throw new Error("Household ID is required.");
  const db = firebase.firestore();
  const snapshot = await db.collection('households').doc(householdId)
                               .collection('investments')
                               .orderBy('createdAt', 'desc') // Example ordering
                               .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Updates an existing investment within a household.
 * @param {string} householdId - The ID of the household.
 * @param {string} investmentId - The ID of the investment to update.
 * @param {object} updatedData - An object containing the fields to update.
 * @returns {Promise<void>}
 */
async function updateHouseholdInvestment(householdId, investmentId, updatedData) {
  if (!householdId || !investmentId) throw new Error("Household ID and Investment ID are required.");
  const db = firebase.firestore();
  const dataToUpdate = {
    ...updatedData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  // Prevent changing user_id or createdAt
  delete dataToUpdate.user_id;
  delete dataToUpdate.createdAt;

  await db.collection('households').doc(householdId)
          .collection('investments').doc(investmentId)
          .update(dataToUpdate);
}

/**
 * Deletes an investment from a household.
 * @param {string} householdId - The ID of the household.
 * @param {string} investmentId - The ID of the investment to delete.
 * @returns {Promise<void>}
 */
async function deleteHouseholdInvestment(householdId, investmentId) {
  if (!householdId || !investmentId) throw new Error("Household ID and Investment ID are required.");
  const db = firebase.firestore();
  // Note: This does not delete subcollections (like transactions) automatically.
  // A Cloud Function would be needed for cascading deletes if required.
  await db.collection('households').doc(householdId)
          .collection('investments').doc(investmentId)
          .delete();
}

// --- Transaction Functions ---

/**
 * Adds a transaction to a specific investment within a household.
 * @param {string} householdId - The ID of the household.
 * @param {string} investmentId - The ID of the investment.
 * @param {object} transactionData - The transaction data to add.
 * @returns {Promise<string>} The ID of the newly created transaction.
 */
async function addHouseholdInvestmentTransaction(householdId, investmentId, transactionData) {
  if (!householdId || !investmentId) throw new Error("Household ID and Investment ID are required.");
  if (!firebase.auth().currentUser) throw new Error("User not authenticated.");
  const db = firebase.firestore();

  const dataToAdd = {
    ...transactionData,
    user_id: firebase.auth().currentUser.uid, // UID of the user creating the transaction
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const transactionRef = await db.collection('households').doc(householdId)
                                     .collection('investments').doc(investmentId)
                                     .collection('transactions').add(dataToAdd);
  return transactionRef.id;
}

/**
 * Fetches all transactions for a specific investment within a household.
 * @param {string} householdId - The ID of the household.
 * @param {string} investmentId - The ID of the investment.
 * @returns {Promise<Array<object>>} An array of transaction objects, each with its ID.
 */
async function getHouseholdInvestmentTransactions(householdId, investmentId) {
  if (!householdId || !investmentId) throw new Error("Household ID and Investment ID are required.");
  const db = firebase.firestore();
  const snapshot = await db.collection('households').doc(householdId)
                           .collection('investments').doc(investmentId)
                           .collection('transactions')
                           .orderBy('transaction_date', 'asc') // Typically order transactions by date
                           .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Updates an existing transaction for an investment within a household.
 * @param {string} householdId - The ID of the household.
 * @param {string} investmentId - The ID of the investment.
 * @param {string} transactionId - The ID of the transaction to update.
 * @param {object} updatedData - An object containing the fields to update.
 * @returns {Promise<void>}
 */
async function updateHouseholdInvestmentTransaction(householdId, investmentId, transactionId, updatedData) {
  if (!householdId || !investmentId || !transactionId) throw new Error("Household, Investment, and Transaction IDs are required.");
  const db = firebase.firestore();
  const dataToUpdate = {
    ...updatedData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  delete dataToUpdate.user_id;
  delete dataToUpdate.createdAt;

  await db.collection('households').doc(householdId)
          .collection('investments').doc(investmentId)
          .collection('transactions').doc(transactionId)
          .update(dataToUpdate);
}

/**
 * Deletes a transaction for an investment within a household.
 * @param {string} householdId - The ID of the household.
 * @param {string} investmentId - The ID of the investment.
 * @param {string} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>}
 */
async function deleteHouseholdInvestmentTransaction(householdId, investmentId, transactionId) {
  if (!householdId || !investmentId || !transactionId) throw new Error("Household, Investment, and Transaction IDs are required.");
  const db = firebase.firestore();
  await db.collection('households').doc(householdId)
          .collection('investments').doc(investmentId)
          .collection('transactions').doc(transactionId)
          .delete();
}
