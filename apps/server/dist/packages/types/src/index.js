// ─── Enums ──────────────────────────────────────────────────────────────────
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "ACTIVE";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["ON_HOLD"] = "ON_HOLD";
})(ProjectStatus || (ProjectStatus = {}));
export var TargetType;
(function (TargetType) {
    TargetType["PROJECT"] = "PROJECT";
    TargetType["SUB_PROJECT"] = "SUB_PROJECT";
    TargetType["CHILD_PROJECT"] = "CHILD_PROJECT";
})(TargetType || (TargetType = {}));
export var AllocationStatus;
(function (AllocationStatus) {
    AllocationStatus["ALLOCATED"] = "ALLOCATED";
    AllocationStatus["USED"] = "USED";
})(AllocationStatus || (AllocationStatus = {}));
export var RateType;
(function (RateType) {
    RateType["DAILY"] = "DAILY";
    RateType["MONTHLY"] = "MONTHLY";
})(RateType || (RateType = {}));
export var QuotationStatus;
(function (QuotationStatus) {
    QuotationStatus["DRAFT"] = "DRAFT";
    QuotationStatus["SENT"] = "SENT";
    QuotationStatus["ACCEPTED"] = "ACCEPTED";
    QuotationStatus["REJECTED"] = "REJECTED";
})(QuotationStatus || (QuotationStatus = {}));
export var DivisionMethod;
(function (DivisionMethod) {
    DivisionMethod["EQUAL"] = "EQUAL";
    DivisionMethod["PROPORTIONAL"] = "PROPORTIONAL";
})(DivisionMethod || (DivisionMethod = {}));
//# sourceMappingURL=index.js.map