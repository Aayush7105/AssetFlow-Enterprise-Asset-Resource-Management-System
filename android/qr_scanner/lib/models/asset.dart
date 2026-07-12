class AssetAllocation {
  final String allocationId;
  final String? allocatedDate;
  final String? expectedReturnDate;
  final String allocationStatus;
  final String allocatedToId;
  final String allocatedToName;
  final String allocatedToEmail;
  final String? allocatedToPhone;
  final String? allocatedByName;

  AssetAllocation({
    required this.allocationId,
    this.allocatedDate,
    this.expectedReturnDate,
    required this.allocationStatus,
    required this.allocatedToId,
    required this.allocatedToName,
    required this.allocatedToEmail,
    this.allocatedToPhone,
    this.allocatedByName,
  });

  factory AssetAllocation.fromJson(Map<String, dynamic> json) {
    return AssetAllocation(
      allocationId: json['allocation_id'],
      allocatedDate: json['allocated_date'],
      expectedReturnDate: json['expected_return_date'],
      allocationStatus: json['allocation_status'] ?? 'ACTIVE',
      allocatedToId: json['allocated_to_id'],
      allocatedToName: json['allocated_to_name'],
      allocatedToEmail: json['allocated_to_email'],
      allocatedToPhone: json['allocated_to_phone'],
      allocatedByName: json['allocated_by_name'],
    );
  }
}

class AssetMaintenance {
  final String maintenanceId;
  final String issueDescription;
  final String priority;
  final String maintenanceStatus;
  final String? requestedAt;
  final String? completedAt;
  final String raisedByName;

  AssetMaintenance({
    required this.maintenanceId,
    required this.issueDescription,
    required this.priority,
    required this.maintenanceStatus,
    this.requestedAt,
    this.completedAt,
    required this.raisedByName,
  });

  factory AssetMaintenance.fromJson(Map<String, dynamic> json) {
    return AssetMaintenance(
      maintenanceId: json['maintenance_id'],
      issueDescription: json['issue_description'],
      priority: json['priority'] ?? 'MEDIUM',
      maintenanceStatus: json['maintenance_status'] ?? 'PENDING',
      requestedAt: json['requested_at'],
      completedAt: json['completed_at'],
      raisedByName: json['raised_by_name'],
    );
  }
}

class Asset {
  final String id;
  final String assetTag;
  final String name;
  final String? serialNumber;
  final String? acquisitionDate;
  final double? acquisitionCost;
  final String assetCondition;
  final String? location;
  final bool isBookable;
  final String status;
  final String? photoUrl;
  final String? categoryId;
  final String? categoryName;
  final String? departmentId;
  final String? departmentName;
  final String? departmentCode;
  final AssetAllocation? allocation;
  final AssetMaintenance? maintenance;

  Asset({
    required this.id,
    required this.assetTag,
    required this.name,
    this.serialNumber,
    this.acquisitionDate,
    this.acquisitionCost,
    required this.assetCondition,
    this.location,
    required this.isBookable,
    required this.status,
    this.photoUrl,
    this.categoryId,
    this.categoryName,
    this.departmentId,
    this.departmentName,
    this.departmentCode,
    this.allocation,
    this.maintenance,
  });

  factory Asset.fromJson(Map<String, dynamic> json) {
    return Asset(
      id: json['id'],
      assetTag: json['asset_tag'],
      name: json['name'],
      serialNumber: json['serial_number'],
      acquisitionDate: json['acquisition_date'],
      acquisitionCost: json['acquisition_cost'] != null
          ? double.tryParse(json['acquisition_cost'].toString())
          : null,
      assetCondition: json['asset_condition'] ?? 'GOOD',
      location: json['location'],
      isBookable: json['is_bookable'] ?? false,
      status: json['status'] ?? 'AVAILABLE',
      photoUrl: json['photo_url'],
      categoryId: json['category_id'],
      categoryName: json['category_name'],
      departmentId: json['department_id'],
      departmentName: json['department_name'],
      departmentCode: json['department_code'],
      allocation: json['allocation'] != null
          ? AssetAllocation.fromJson(json['allocation'])
          : null,
      maintenance: json['maintenance'] != null
          ? AssetMaintenance.fromJson(json['maintenance'])
          : null,
    );
  }
}
