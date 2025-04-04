const Router = require("koa-router");
const TokenController = require("../controllers/token");

const router = new Router();
const tokenController = new TokenController();

router.prefix("/token");

/**
 * @swagger
 * /token:
 *   get:
 *     summary: Get token information
 *     description: Retrieve token details and optionally check balance for a specific address
 *     parameters:
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Address to check token balance for
 *     responses:
 *       200:
 *         description: Token information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 response:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     symbol:
 *                       type: string
 *                     decimals:
 *                       type: integer
 *                     address:
 *                       type: string
 *                     userAddress:
 *                       type: string
 *                     balance:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (ctx) => tokenController.getTokenInfo(ctx));

/**
 * @swagger
 * /token/transfer:
 *   post:
 *     summary: Transfer tokens
 *     description: Transfer tokens from one address to another
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - toAddress
 *               - amount
 *             properties:
 *               fromAddress:
 *                 type: string
 *                 description: Source address
 *               toAddress:
 *                 type: string
 *                 description: Destination address
 *               amount:
 *                 type: string
 *                 description: Amount to transfer
 *               withDecimals:
 *                 type: boolean
 *                 description: Whether the amount is already in decimals
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 response:
 *                   type: object
 *                   properties:
 *                     txHash:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., insufficient balance)
 *       500:
 *         description: Server error
 */
router.post("/transfer", async (ctx) => tokenController.transfer(ctx));

module.exports = router;
