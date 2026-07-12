import 'package:flutter/material.dart';
import 'package:qr_scanner/models/asset.dart';

class AssetDetailScreen extends StatelessWidget {
  final Asset asset;
  const AssetDetailScreen({super.key, required this.asset});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Asset Details'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Asset header
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: _statusColor(asset.status)
                                .withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(
                            _statusIcon(asset.status),
                            color: _statusColor(asset.status),
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                asset.name,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                asset.assetTag,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: Colors.white.withValues(alpha: 0.5),
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ],
                          ),
                        ),
                        _statusBadge(theme, asset.status),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Asset info card
            _sectionCard(
              theme,
              title: 'Asset Information',
              icon: Icons.info_outline_rounded,
              children: [
                _infoRow('Serial Number', asset.serialNumber ?? '—'),
                _infoRow('Condition', asset.assetCondition),
                _infoRow('Location', asset.location ?? '—'),
                _infoRow('Bookable', asset.isBookable ? 'Yes' : 'No'),
                Builder(builder: (context) {
                  final acqDate = asset.acquisitionDate;
                  if (acqDate != null) {
                    return _infoRow(
                      'Acquired',
                      acqDate.split('T').first,
                    );
                  }
                  return const SizedBox.shrink();
                }),
                Builder(builder: (context) {
                  final acqCost = asset.acquisitionCost;
                  if (acqCost != null) {
                    return _infoRow(
                      'Cost',
                      '₹${acqCost.toStringAsFixed(2)}',
                    );
                  }
                  return const SizedBox.shrink();
                }),
              ],
            ),
            const SizedBox(height: 12),

            // Category
            _sectionCard(
              theme,
              title: 'Category',
              icon: Icons.category_rounded,
              children: [
                _infoRow('Name', asset.categoryName ?? '—'),
              ],
            ),
            const SizedBox(height: 12),

            // Department
            _sectionCard(
              theme,
              title: 'Department',
              icon: Icons.business_rounded,
              children: [
                _infoRow('Name', asset.departmentName ?? '—'),
                _infoRow('Code', asset.departmentCode ?? '—'),
              ],
            ),
            const SizedBox(height: 12),

            // Allocation
            if (asset.allocation != null) ...[
              _sectionCard(
                theme,
                title: 'Current Allocation',
                icon: Icons.person_rounded,
                accentColor: Colors.tealAccent,
                children: [
                  _infoRow(
                    'Assigned To',
                    asset.allocation!.allocatedToName,
                  ),
                  _infoRow('Email', asset.allocation!.allocatedToEmail),
                  if (asset.allocation!.allocatedToPhone != null)
                    _infoRow('Phone', asset.allocation!.allocatedToPhone!),
                  if (asset.allocation!.allocatedByName != null)
                    _infoRow(
                      'Allocated By',
                      asset.allocation!.allocatedByName!,
                    ),
                  if (asset.allocation!.allocatedDate != null)
                    _infoRow(
                      'Date',
                      asset.allocation!.allocatedDate!.split('T').first,
                    ),
                  if (asset.allocation!.expectedReturnDate != null)
                    _infoRow(
                      'Expected Return',
                      asset.allocation!.expectedReturnDate!.split('T').first,
                    ),
                  _infoRow('Status', asset.allocation!.allocationStatus),
                ],
              ),
              const SizedBox(height: 12),
            ] else
              _sectionCard(
                theme,
                title: 'Allocation',
                icon: Icons.person_outline_rounded,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text(
                      'This asset is not currently allocated to anyone.',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.white.withValues(alpha: 0.4),
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                ],
              ),
            const SizedBox(height: 12),

            // Maintenance
            if (asset.maintenance != null) ...[
              _sectionCard(
                theme,
                title: 'Latest Maintenance',
                icon: Icons.build_rounded,
                accentColor: Colors.orangeAccent,
                children: [
                  _infoRow('Issue', asset.maintenance!.issueDescription),
                  _infoRow('Priority', asset.maintenance!.priority),
                  _infoRow('Status', asset.maintenance!.maintenanceStatus),
                  _infoRow('Raised By', asset.maintenance!.raisedByName),
                  if (asset.maintenance!.requestedAt != null)
                    _infoRow(
                      'Requested',
                      asset.maintenance!.requestedAt!.split('T').first,
                    ),
                  if (asset.maintenance!.completedAt != null)
                    _infoRow(
                      'Completed',
                      asset.maintenance!.completedAt!.split('T').first,
                    ),
                ],
              ),
              const SizedBox(height: 12),
            ],

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _sectionCard(
    ThemeData theme, {
    required String title,
    required IconData icon,
    required List<Widget> children,
    Color? accentColor,
  }) {
    final color = accentColor ?? theme.colorScheme.primary;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 18, color: color),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: color,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                color: Colors.white.withValues(alpha: 0.4),
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusBadge(ThemeData theme, String status) {
    final color = _statusColor(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status.replaceAll('_', ' '),
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'AVAILABLE':
        return Colors.greenAccent;
      case 'ALLOCATED':
        return Colors.lightBlueAccent;
      case 'RESERVED':
        return Colors.amberAccent;
      case 'UNDER_MAINTENANCE':
        return Colors.orangeAccent;
      case 'LOST':
        return Colors.redAccent;
      case 'RETIRED':
      case 'DISPOSED':
        return Colors.grey;
      default:
        return Colors.white54;
    }
  }

  IconData _statusIcon(String status) {
    switch (status) {
      case 'AVAILABLE':
        return Icons.check_circle_outline_rounded;
      case 'ALLOCATED':
        return Icons.person_rounded;
      case 'RESERVED':
        return Icons.schedule_rounded;
      case 'UNDER_MAINTENANCE':
        return Icons.build_rounded;
      case 'LOST':
        return Icons.error_outline_rounded;
      case 'RETIRED':
      case 'DISPOSED':
        return Icons.archive_rounded;
      default:
        return Icons.devices_rounded;
    }
  }
}
