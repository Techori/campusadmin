const Job = require('../models/Job');
const Application = require('../models/Application');
const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Notification = require('../models/Notificationstu'); 

exports.getDashboardData = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No session user' });
    }

    const userId = req.session.user.id;

    // Opportunities
    const totalOpportunities = await Job.countDocuments();
    const savedOpportunities = await Job.countDocuments({ savedBy: userId });

    // Status definitions (UI aligned)
    const statusDefs = [
      { status: "Applied", color: "blue" },
      { status: "Under Review", color: "yellow" },
      { status: "Interview", color: "purple" },
      { status: "Offered", color: "green" },
      { status: "Rejected", color: "red" },
      { status: "Withdrawn", color: "gray" }
    ];
    // Map DB statuses to UI statuses
    const dbToUiStatus = {
      "Applied": "Applied",
      "Under Review": "Under Review",
      "Interview Scheduled": "Interview",
      "Interview": "Interview",
      "Offer Received": "Offered",
      "Offered": "Offered",
      "Rejected": "Rejected",
      "Withdrawn": "Withdrawn"
    };

    // Applications overview
    const applicationsOverview = [];
    for (const { status, color } of statusDefs) {
      const possibleDbStatuses = Object.entries(dbToUiStatus)
        .filter(([db, ui]) => ui === status)
        .map(([db]) => db);

      const count = await Application.countDocuments({
        student: userId,
        status: { $in: possibleDbStatuses }
      });
      if (count > 0) applicationsOverview.push({ status, count, color });
    }

    // ==== REAL NOTIFICATIONS ====
    // Fetch the latest 10 notifications for this student
    const notificationsList = await Notification.find({ student: userId })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    // Recent feedback (ensure your Feedback model has student, company, title, rating, message/feedback, date)
    const recentFeedback = await Feedback.find({ student: userId })
      .sort({ date: -1 })
      .limit(4)
      .lean();

    // Interview schedule
    const interviewApplications = await Application.find({
      student: userId,
      status: { $in: ["Interview Scheduled", "Interview"] },
      interviewDate: { $gte: new Date() }
    })
      .sort({ interviewDate: 1 })
      .limit(3)
      .populate('job')
      .lean();

    const interviewSchedule = interviewApplications.map(app => ({
      id: app._id,
      company: app.job?.company || "",
      title: app.job?.title || "",
      date: app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : "",
      time: app.interviewDate ? new Date(app.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
    }));

    // Student basic info
    const student = await Student.findById(userId).lean();

    // ==== PROFILE COMPLETION (INLINE & EXTENSIBLE) ====
    let profileCompletion = 0;
if (student) {
  // Each field gets 10 points. Adjust/add fields and weights as you see fit.
  const fields = [
    { key: 'name', weight: 8, isComplete: s => !!s.name },
    { key: 'email', weight: 8, isComplete: s => !!s.email },
    { key: 'phone', weight: 8, isComplete: s => !!s.phone },
    { key: 'profileImage', weight: 8, isComplete: s => !!s.profileImage },
    { key: 'resume', weight: 8, isComplete: s => !!s.resume },
    { key: 'skills', weight: 8, isComplete: s => Array.isArray(s.skills) && s.skills.length > 0 },
    { key: 'programmingLanguages', weight: 8, isComplete: s => Array.isArray(s.programmingLanguages) && s.programmingLanguages.length > 0 },
    { key: 'projects', weight: 8, isComplete: s => Array.isArray(s.projects) && s.projects.length > 0 },
    { key: 'achievements', weight: 8, isComplete: s => Array.isArray(s.achievements) && s.achievements.length > 0 },
    { key: 'certifications', weight: 8, isComplete: s => Array.isArray(s.certifications) && s.certifications.length > 0 },
    // You can also add social/profile links for further completion
    { key: 'githubUrl', weight: 4, isComplete: s => !!s.githubUrl },
    { key: 'linkedinUrl', weight: 4, isComplete: s => !!s.linkedinUrl },
    { key: 'portfolioUrl', weight: 4, isComplete: s => !!s.portfolioUrl },
    // Optionally add more, e.g. dateOfBirth, location, department, etc.
  ];

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);

  let score = 0;
  for (const field of fields) {
    if (field.isComplete(student)) {
      score += field.weight;
    }
  }

  profileCompletion = Math.round((score / totalWeight) * 100);
  if (profileCompletion > 100) profileCompletion = 100;
}
    res.json({
      student: student ? { name: student.name, email: student.email } : {},
      profileCompletion,
      opportunitiesOverview: { total: totalOpportunities, saved: savedOpportunities },
      applicationsOverview,
      notificationsList,
      recentFeedback: recentFeedback.map(fb => ({
        _id: fb._id,
        company: fb.company,
        title: fb.title || "",
        rating: fb.rating || 0,
        comment: fb.message || fb.feedback || "",
        date: fb.date ? new Date(fb.date).toLocaleDateString() : "",
      })),
      interviewSchedule
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
};