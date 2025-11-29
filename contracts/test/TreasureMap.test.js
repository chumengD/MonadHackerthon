const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasureMap", function () {
  let treasureMap;
  let owner;
  let creator;
  let player1;
  let player2;

  const ENTRY_FEE = ethers.parseEther("0.01");
  const PRIZE_POOL = ethers.parseEther("0.1");
  const CORRECT_ANSWER = "secret treasure location";
  const WRONG_ANSWER = "wrong answer";
  const METADATA_URI = "ipfs://QmTest123456";

  beforeEach(async function () {
    [owner, creator, player1, player2] = await ethers.getSigners();

    const TreasureMap = await ethers.getContractFactory("TreasureMap");
    treasureMap = await TreasureMap.deploy();
    await treasureMap.waitForDeployment();
  });

  describe("Map Creation", function () {
    it("Should create a new treasure map", async function () {
      const answerHash = ethers.keccak256(ethers.toUtf8Bytes(CORRECT_ANSWER));

      await expect(
        treasureMap.connect(creator).createMap(METADATA_URI, answerHash, ENTRY_FEE, { value: PRIZE_POOL })
      )
        .to.emit(treasureMap, "MapCreated")
        .withArgs(0, creator.address, PRIZE_POOL, ENTRY_FEE);

      const map = await treasureMap.getMap(0);
      expect(map.creator).to.equal(creator.address);
      expect(map.prizePool).to.equal(PRIZE_POOL);
      expect(map.entryFee).to.equal(ENTRY_FEE);
      expect(map.solved).to.equal(false);
    });

    it("Should fail if no prize pool is provided", async function () {
      const answerHash = ethers.keccak256(ethers.toUtf8Bytes(CORRECT_ANSWER));

      await expect(
        treasureMap.connect(creator).createMap(METADATA_URI, answerHash, ENTRY_FEE, { value: 0 })
      ).to.be.revertedWith("TreasureMap: prize pool required");
    });
  });

  describe("Map Unlock", function () {
    let mapId;
    let answerHash;

    beforeEach(async function () {
      answerHash = ethers.keccak256(ethers.toUtf8Bytes(CORRECT_ANSWER));
      await treasureMap.connect(creator).createMap(METADATA_URI, answerHash, ENTRY_FEE, { value: PRIZE_POOL });
      mapId = 0;
    });

    it("Should unlock map with correct entry fee", async function () {
      await expect(
        treasureMap.connect(player1).unlockMap(mapId, { value: ENTRY_FEE })
      )
        .to.emit(treasureMap, "MapUnlocked")
        .withArgs(mapId, player1.address);

      expect(await treasureMap.isUnlocked(mapId, player1.address)).to.equal(true);
    });

    it("Should fail if entry fee is insufficient", async function () {
      const insufficientFee = ENTRY_FEE / 2n;
      await expect(
        treasureMap.connect(player1).unlockMap(mapId, { value: insufficientFee })
      ).to.be.revertedWith("TreasureMap: insufficient entry fee");
    });

    it("Should not allow double unlock", async function () {
      await treasureMap.connect(player1).unlockMap(mapId, { value: ENTRY_FEE });
      
      await expect(
        treasureMap.connect(player1).unlockMap(mapId, { value: ENTRY_FEE })
      ).to.be.revertedWith("TreasureMap: already unlocked");
    });
  });

  describe("Commit-Reveal Flow", function () {
    let mapId;
    let answerHash;
    let salt;
    let commitHash;

    beforeEach(async function () {
      answerHash = ethers.keccak256(ethers.toUtf8Bytes(CORRECT_ANSWER));
      await treasureMap.connect(creator).createMap(METADATA_URI, answerHash, ENTRY_FEE, { value: PRIZE_POOL });
      mapId = 0;

      // Unlock the map first
      await treasureMap.connect(player1).unlockMap(mapId, { value: ENTRY_FEE });

      // Generate commit hash
      salt = ethers.randomBytes(32);
      commitHash = await treasureMap.generateCommitHash(CORRECT_ANSWER, salt, player1.address);
    });

    it("Should commit answer successfully", async function () {
      await expect(
        treasureMap.connect(player1).commitAnswer(mapId, commitHash)
      )
        .to.emit(treasureMap, "AnswerCommitted")
        .withArgs(mapId, player1.address, commitHash);
    });

    it("Should fail to commit without unlocking first", async function () {
      const player2CommitHash = await treasureMap.generateCommitHash(CORRECT_ANSWER, salt, player2.address);
      
      await expect(
        treasureMap.connect(player2).commitAnswer(mapId, player2CommitHash)
      ).to.be.revertedWith("TreasureMap: must unlock first");
    });

    it("Should reveal correct answer and claim prize", async function () {
      await treasureMap.connect(player1).commitAnswer(mapId, commitHash);

      // Mine a block to pass the block requirement
      await ethers.provider.send("evm_mine", []);

      const player1BalanceBefore = await ethers.provider.getBalance(player1.address);

      const tx = await treasureMap.connect(player1).revealAnswer(mapId, CORRECT_ANSWER, salt);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const player1BalanceAfter = await ethers.provider.getBalance(player1.address);

      // Check balance increased by prize minus gas
      expect(player1BalanceAfter).to.equal(player1BalanceBefore + PRIZE_POOL - gasUsed);

      // Check map is solved
      const map = await treasureMap.getMap(mapId);
      expect(map.solved).to.equal(true);
      expect(map.winner).to.equal(player1.address);
    });

    it("Should not claim prize for wrong answer", async function () {
      const wrongCommitHash = await treasureMap.generateCommitHash(WRONG_ANSWER, salt, player1.address);
      await treasureMap.connect(player1).commitAnswer(mapId, wrongCommitHash);

      await ethers.provider.send("evm_mine", []);

      await expect(
        treasureMap.connect(player1).revealAnswer(mapId, WRONG_ANSWER, salt)
      )
        .to.emit(treasureMap, "AnswerRevealed")
        .withArgs(mapId, player1.address, false);

      const map = await treasureMap.getMap(mapId);
      expect(map.solved).to.equal(false);
    });
  });
});
