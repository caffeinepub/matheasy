import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import VarArray "mo:core/VarArray";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type MathTopic = {
    id : Text;
    title : Text;
    description : Text;
    icon : Text;
    color : Text;
  };

  public type PracticeQuestion = {
    id : Text;
    topicId : Text;
    question : Text;
    options : [Text];
    correctOption : Nat;
    explanation : Text;
  };

  public type LessonExample = {
    id : Text;
    problem : Text;
    solution : Text;
  };

  public type Lesson = {
    id : Text;
    topicId : Text;
    title : Text;
    explanation : Text;
    examples : [LessonExample];
  };

  public type QuizResult = {
    topicId : Text;
    score : Nat;
    total : Nat;
    timestamp : Int;
  };

  module QuizResult {
    public func compare(result1 : QuizResult, result2 : QuizResult) : Order.Order {
      Int.compare(result1.timestamp, result2.timestamp);
    };
  };

  public type UserProgress = {
    startedTopics : [Text];
    questionsAnswered : Nat;
    correctAnswers : Nat;
    quizHistory : [QuizResult];
  };

  module UserProgress {
    public func compare(progress1 : UserProgress, progress2 : UserProgress) : Order.Order {
      Int.compare(progress1.questionsAnswered, progress2.questionsAnswered);
    };
  };

  public type UserQuiz = {
    userId : Principal;
    questions : [PracticeQuestion];
    startTime : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  // Storage
  let lessonsState = Map.empty<Text, Lesson>();
  let practiceQuestionsState = Map.empty<Text, PracticeQuestion>();
  let topicsState = Map.empty<Text, MathTopic>();
  let quizState = Map.empty<Principal, UserQuiz>();

  let userProgressState = Map.empty<Principal, UserProgress>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Topic and Lesson Functions (public access)
  public query ({ caller }) func getAllTopics() : async [MathTopic] {
    topicsState.values().toArray();
  };

  public query ({ caller }) func getLessonsForTopic(topicId : Text) : async [Lesson] {
    lessonsState.values().toArray().filter(func(l) { l.topicId == topicId });
  };

  public query ({ caller }) func getPracticeQuestionsForTopic(topicId : Text) : async [PracticeQuestion] {
    practiceQuestionsState.values().toArray().filter(func(q) { q.topicId == topicId });
  };

  // Mark topic as started by user
  public shared ({ caller }) func markTopicStarted(topicId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark topics as started");
    };
    let progress = switch (userProgressState.get(caller)) {
      case (null) {
        {
          startedTopics = [topicId];
          questionsAnswered = 0;
          correctAnswers = 0;
          quizHistory = [];
        };
      };
      case (?p) {
        if (p.startedTopics.find(func(t) { t == topicId }) == null) {
          {
            startedTopics = p.startedTopics.concat([topicId]);
            questionsAnswered = p.questionsAnswered;
            correctAnswers = p.correctAnswers;
            quizHistory = p.quizHistory;
          };
        } else {
          p;
        };
      };
    };
    userProgressState.add(caller, progress);
  };

  // Submit answer to a question
  public shared ({ caller }) func submitAnswer(questionId : Text, selectedOption : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit answers");
    };
    let question = switch (practiceQuestionsState.get(questionId)) {
      case (null) { Runtime.trap("Question not found") };
      case (?q) { q };
    };

    var correct = false;
    if (selectedOption == question.correctOption) {
      correct := true;
    };
    let prevProgress = switch (userProgressState.get(caller)) {
      case (null) {
        {
          startedTopics = [];
          questionsAnswered = 1;
          correctAnswers = if (correct) { 1 } else { 0 };
          quizHistory = [];
        };
      };
      case (?p) {
        {
          startedTopics = p.startedTopics;
          questionsAnswered = p.questionsAnswered + 1;
          correctAnswers = p.correctAnswers + (if (correct) { 1 } else { 0 });
          quizHistory = p.quizHistory;
        };
      };
    };
    userProgressState.add(caller, prevProgress);

    correct;
  };

  // Record quiz result
  public shared ({ caller }) func recordQuizResult(topicId : Text, score : Nat, total : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record quiz results");
    };
    let newQuiz : QuizResult = {
      topicId;
      score;
      total;
      timestamp = Time.now();
    };
    let prevProgress = switch (userProgressState.get(caller)) {
      case (null) {
        {
          startedTopics = [];
          questionsAnswered = 0;
          correctAnswers = 0;
          quizHistory = [newQuiz];
        };
      };
      case (?p) {
        {
          startedTopics = p.startedTopics;
          questionsAnswered = p.questionsAnswered;
          correctAnswers = p.correctAnswers;
          quizHistory = p.quizHistory.concat([newQuiz]);
        };
      };
    };
    userProgressState.add(caller, prevProgress);
  };

  public query ({ caller }) func getUserProgress(userId : Principal) : async UserProgress {
    // Users can only view their own progress, admins can view any user's progress
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress");
    };
    switch (userProgressState.get(userId)) {
      case (null) {
        {
          startedTopics = [];
          questionsAnswered = 0;
          correctAnswers = 0;
          quizHistory = [];
        };
      };
      case (?p) { p };
    };
  };

  public query ({ caller }) func getQuizQuestions(topicId : Text) : async [PracticeQuestion] {
    let allQuestions = if (topicId == "mixed") {
      practiceQuestionsState.values().toArray();
    } else {
      practiceQuestionsState.values().toArray().filter(func(q) { q.topicId == topicId });
    };
    let total = allQuestions.size();
    if (total == 0) {
      return [];
    };
    let selectedIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let questions = VarArray.repeat<PracticeQuestion>(allQuestions[0], 10);
    for (i in Nat.range(0, selectedIndices.size())) {
      let idx = if (i < total) { i } else { 0 };
      let arrayIdx = Int.abs(idx);
      if (arrayIdx < total) {
        questions[i] := allQuestions[arrayIdx];
      };
    };
    questions.toArray();
  };

  func addTopics() {
    let topicsArray1 : [(Text, MathTopic)] = [
      (
        "algebra",
        {
          id = "algebra";
          title = "Algebra";
          description = "Variables, equations, and expressions";
          icon = "function";
          color = "#8ecae6";
        },
      ),
      (
        "geometry",
        {
          id = "geometry";
          title = "Geometry";
          description = "Shapes, lines, angles, and areas";
          icon = "triangle";
          color = "#219ebc";
        },
      ),
    ];
    let topicsArray2 : [(Text, MathTopic)] = [
      (
        "calculus",
        {
          id = "calculus";
          title = "Calculus";
          description = "Limits, derivatives, integrals";
          icon = "symbol-math";
          color = "#023047";
        },
      ),
      (
        "statistics",
        {
          id = "statistics";
          title = "Statistics";
          description = "Mean, median, graphs, distributions";
          icon = "graph-bar";
          color = "#ffb703";
        },
      ),
    ];
    let topicsArray3 : [(Text, MathTopic)] = [
      (
        "trigonometry",
        {
          id = "trigonometry";
          title = "Trigonometry";
          description = "Triangles, sine, cosine";
          icon = "caret-up";
          color = "#fb8500";
        },
      ),
      (
        "functions",
        {
          id = "functions";
          title = "Functions";
          description = "Linear, quadratic, cubic functions";
          icon = "graph-trend";
          color = "#8d99ae";
        },
      ),
    ];
    // Use add instead of addAll
    topicsArray1.forEach(
      func(topic) {
        topicsState.add(topic.0, topic.1);
      }
    );
    topicsArray2.forEach(
      func(topic) {
        topicsState.add(topic.0, topic.1);
      }
    );
    topicsArray3.forEach(
      func(topic) {
        topicsState.add(topic.0, topic.1);
      }
    );
  };

  func addLessons() {
    let algebraLessons = [
      (
        "lesson1",
        {
          id = "lesson1";
          topicId = "algebra";
          title = "Linear Equations";
          explanation = "Equations with variables of degree 1";
          examples = [
            {
              id = "ex1";
              problem = "Solve 2x + 3 = 7";
              solution = "Subtract 3: 2x = 4. Divide by 2: x = 2";
            },
            {
              id = "ex2";
              problem = "Solve x / 2 + 1 = 3";
              solution = "Subtract 1: x/2 = 2. Multiply by 2: x = 4";
            },
          ];
        },
      ),
      (
        "lesson2",
        {
          id = "lesson2";
          topicId = "algebra";
          title = "Quadratic Equations";
          explanation = "Degree 2 equations, standard form ax^2 + bx + c = 0";
          examples = [
            {
              id = "ex1";
              problem = "Solve 2x^2 + 3x - 2";
              solution = "Rewrite as (2x + 4)(x - 1) = 0. Solutions: x = -2, x = 1";
            },
            {
              id = "ex2";
              problem = "Factor x^2 - 9";
              solution = "(x + 3)(x - 3)";
            },
          ];
        },
      ),
    ];
    algebraLessons.forEach(
      func(l) {
        lessonsState.add(l.0, l.1);
      }
    );

    let geometryLessons = [
      (
        "lesson3",
        {
          id = "lesson3";
          topicId = "geometry";
          title = "Triangles";
          explanation = "Study of shapes with 3 sides and 3 angles";
          examples = [
            {
              id = "ex1";
              problem = "Find area of triangle with base 8, height 5";
              solution = "Area = 1/2 * base * height = 1/2 * 8 * 5 = 20";
            },
            {
              id = "ex2";
              problem = "Find perimeter of triangle with sides 6, 8, 10";
              solution = "Perimeter = 6+8+10 = 24";
            },
          ];
        },
      ),
      (
        "lesson4",
        {
          id = "lesson4";
          topicId = "geometry";
          title = "Circles";
          explanation = "Study of perfect round shapes, radius from center";
          examples = [
            {
              id = "ex1";
              problem = "Find circumference of circle with r=7";
              solution = "Circumference = 2 * pi * 7 = 44";
            },
            {
              id = "ex2";
              problem = "Area with radius 4";
              solution = "Area = pi * r^2 = 3.14 * 16 = 50.24";
            },
          ];
        },
      ),
    ];
    geometryLessons.forEach(
      func(l) {
        lessonsState.add(l.0, l.1);
      }
    );
  };

  func addQuestions() {
    let questions = [
      (
        "q1",
        {
          id = "q1";
          topicId = "algebra";
          question = "What variable solves x + 5 = 10?";
          options = ["2", "3", "5", "10"];
          correctOption = 2;
          explanation = "Subtract 5 from both sides: x = 10 - 5 = 5";
        },
      ),
      (
        "q2",
        {
          id = "q2";
          topicId = "geometry";
          question = "What is the area of a rectangle with h=3, w=7?";
          options = ["10", "12", "20", "21"];
          correctOption = 3;
          explanation = "Area = 3 * 7 = 21";
        },
      ),
      (
        "q3",
        {
          id = "q3";
          topicId = "algebra";
          question = "Solve for x: 2x = 8";
          options = ["2", "3", "4", "5"];
          correctOption = 2;
          explanation = "x = 8 / 2 = 4";
        },
      ),
      (
        "q4",
        {
          id = "q4";
          topicId = "geometry";
          question = "How many sides does a triangle have?";
          options = ["1", "2", "3", "4"];
          correctOption = 2;
          explanation = "Triangles have 3 sides, by definition";
        },
      ),
      (
        "q5",
        {
          id = "q5";
          topicId = "algebra";
          question = "What is the variable in 2x + 3?";
          options = ["2", "3", "x", "y"];
          correctOption = 2;
          explanation = "The variable is x, the letter representing an unknown value";
        },
      ),
    ];
    questions.forEach(
      func(q) {
        practiceQuestionsState.add(q.0, q.1);
      }
    );
  };

  public shared ({ caller }) func seedBackend() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };
    addTopics();
    addLessons();
    addQuestions();
  };
};
