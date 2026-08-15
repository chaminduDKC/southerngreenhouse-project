var ProjectStatus = /* @__PURE__ */ ((ProjectStatus2) => {
  ProjectStatus2["ACTIVE"] = "ACTIVE";
  ProjectStatus2["IN_PROGRESS"] = "IN_PROGRESS";
  ProjectStatus2["COMPLETED"] = "COMPLETED";
  ProjectStatus2["ON_HOLD"] = "ON_HOLD";
  return ProjectStatus2;
})(ProjectStatus || {});
var TargetType = /* @__PURE__ */ ((TargetType2) => {
  TargetType2["PROJECT"] = "PROJECT";
  TargetType2["SUB_PROJECT"] = "SUB_PROJECT";
  TargetType2["CHILD_PROJECT"] = "CHILD_PROJECT";
  return TargetType2;
})(TargetType || {});
var RateType = /* @__PURE__ */ ((RateType2) => {
  RateType2["DAILY"] = "DAILY";
  RateType2["MONTHLY"] = "MONTHLY";
  return RateType2;
})(RateType || {});
export {
  ProjectStatus as P,
  RateType as R,
  TargetType as T
};
