const Group = require('../models/group.model');

exports.pickNumber = async (req, res) => {
  const { userId, number } = req.body;
  await Group.assignNumber(userId, number);
  res.redirect(`/group/${number}`);
};

exports.getGroupPage = async (req, res) => {
  const members = await Group.getGroupMembers(req.params.number);
  res.json({ members }); // Or render HTML
};
