import 'package:flutter/material.dart';
import 'package:qr_scanner/core/constants.dart';
import 'package:qr_scanner/services/auth_service.dart';

class HomeScreen extends StatelessWidget {
  final AuthService authService;
  const HomeScreen({super.key, required this.authService});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = authService.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('AssetFlow Scanner'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Logout',
            onPressed: () async {
              await authService.logout();
              if (!context.mounted) return;
              Navigator.of(context).pushReplacementNamed(
                AppConstants.loginRoute,
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // User info card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: theme.colorScheme.primary
                            .withValues(alpha: 0.15),
                        child: Text(
                          (user?.name ?? 'U')[0].toUpperCase(),
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user?.name ?? 'User',
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              user?.email ?? '',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: Colors.white.withValues(alpha: 0.5),
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (user?.role != null)
                        Builder(
                          builder: (context) {
                            final userRole = user!.role!;
                            return Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: _roleBadgeColor(userRole)
                                    .withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                _formatRole(userRole),
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: _roleBadgeColor(userRole),
                                ),
                              ),
                            );
                          }
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              // Scan section
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary
                              .withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(32),
                        ),
                        child: Icon(
                          Icons.qr_code_scanner_rounded,
                          size: 56,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Scan Asset QR Code',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Point your camera at a QR code on any\nasset to view its details',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: Colors.white.withValues(alpha: 0.5),
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: 220,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.of(context).pushNamed(
                              AppConstants.scannerRoute,
                            );
                          },
                          icon: const Icon(Icons.camera_alt_rounded, size: 20),
                          label: const Text('Open Scanner'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: (user?.role == 'ADMIN' || 
                             user?.role == 'ASSET_MANAGER' || 
                             user?.role == 'DEPARTMENT_HEAD')
          ? FloatingActionButton(
              onPressed: () {
                Navigator.of(context).pushNamed('/asset-form');
              },
              child: const Icon(Icons.add_rounded),
            )
          : null,
    );
  }

  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
        return Colors.green.shade500;
      case 'ALLOCATED':
      case 'IN_USE':
        return Colors.blue.shade500;
      case 'RESERVED':
        return Colors.amber.shade500;
      case 'UNDER_MAINTENANCE':
      case 'MAINTENANCE':
        return Colors.orange.shade500;
      case 'LOST':
        return Colors.red.shade700;
      case 'RETIRED':
        return Colors.red.shade500;
      case 'DISPOSED':
        return Colors.grey.shade500;
      default:
        return Colors.grey.shade500;
    }
  }

  Color _roleBadgeColor(String role) {
    switch (role) {
      case 'ADMIN':
        return Colors.amber.shade500;
      case 'DEPARTMENT_HEAD':
        return Colors.teal.shade500;
      case 'ASSET_MANAGER':
        return Colors.blue.shade500;
      case 'AUDITOR':
        return Colors.purple.shade500;
      case 'EMPLOYEE':
        return Colors.grey.shade500;
      default:
        return Colors.grey.shade500;
    }
  }

  String _formatRole(String role) {
    return role.replaceAll('_', ' ');
  }
}
