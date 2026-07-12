import 'package:flutter/material.dart';
import 'package:qr_scanner/models/asset.dart';
import 'package:qr_scanner/services/api_service.dart';

class AssetFormScreen extends StatefulWidget {
  final Asset? asset;

  const AssetFormScreen({super.key, this.asset});

  @override
  State<AssetFormScreen> createState() => _AssetFormScreenState();
}

class _AssetFormScreenState extends State<AssetFormScreen> {
  final _formKey = GlobalKey<FormState>();
  
  late TextEditingController _nameController;
  late TextEditingController _serialNumberController;
  late TextEditingController _locationController;
  late TextEditingController _categoryIdController;
  late TextEditingController _departmentIdController;

  String _condition = 'GOOD';
  String _status = 'AVAILABLE';
  bool _isBookable = false;
  bool _isLoading = false;

  final List<String> _conditions = ['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];
  final List<String> _statuses = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED', 'LOST'];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.asset?.name ?? '');
    _serialNumberController = TextEditingController(text: widget.asset?.serialNumber ?? '');
    _locationController = TextEditingController(text: widget.asset?.location ?? '');
    _categoryIdController = TextEditingController(text: widget.asset?.categoryId ?? '');
    _departmentIdController = TextEditingController(text: widget.asset?.departmentId ?? '');
    
    if (widget.asset != null) {
      _condition = widget.asset!.assetCondition;
      _status = widget.asset!.status;
      _isBookable = widget.asset!.isBookable;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _serialNumberController.dispose();
    _locationController.dispose();
    _categoryIdController.dispose();
    _departmentIdController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final payload = {
      'name': _nameController.text.trim(),
      'serial_number': _serialNumberController.text.trim(),
      'location': _locationController.text.trim(),
      'category_id': _categoryIdController.text.trim(),
      'department_id': _departmentIdController.text.trim(),
      'asset_condition': _condition,
      'status': _status,
      'is_bookable': _isBookable,
    };

    try {
      final isUpdate = widget.asset != null;
      final response = isUpdate
          ? await ApiService.instance.put('/assets/${widget.asset!.id}', body: payload)
          : await ApiService.instance.post('/assets', body: payload);

      if (!mounted) return;

      if (response['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(isUpdate ? 'Asset updated successfully' : 'Asset created successfully'),
            backgroundColor: Colors.green.shade700,
          ),
        );
        Navigator.of(context).pop();
      } else {
        _showError(response['message'] ?? 'Operation failed');
      }
    } catch (e) {
      if (!mounted) return;
      _showError('Failed to save asset. Backend may return 403 Forbidden based on roles.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red.shade700,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isUpdate = widget.asset != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isUpdate ? 'Edit Asset' : 'Add Asset'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildTextField(
                      controller: _nameController,
                      label: 'Asset Name',
                      icon: Icons.label_rounded,
                      validator: (value) =>
                          value == null || value.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _serialNumberController,
                      label: 'Serial Number',
                      icon: Icons.tag_rounded,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _categoryIdController,
                      label: 'Category ID (UUID)',
                      icon: Icons.category_rounded,
                      validator: (value) =>
                          value == null || value.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _departmentIdController,
                      label: 'Department ID (UUID)',
                      icon: Icons.business_rounded,
                      validator: (value) =>
                          value == null || value.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _locationController,
                      label: 'Location',
                      icon: Icons.location_on_rounded,
                    ),
                    const SizedBox(height: 16),
                    _buildDropdown(
                      label: 'Condition',
                      value: _condition,
                      items: _conditions,
                      icon: Icons.health_and_safety_rounded,
                      onChanged: (val) {
                        if (val != null) setState(() => _condition = val);
                      },
                    ),
                    const SizedBox(height: 16),
                    _buildDropdown(
                      label: 'Status',
                      value: _status,
                      items: _statuses,
                      icon: Icons.info_rounded,
                      onChanged: (val) {
                        if (val != null) setState(() => _status = val);
                      },
                    ),
                    const SizedBox(height: 16),
                    SwitchListTile(
                      title: const Text('Is Bookable'),
                      value: _isBookable,
                      onChanged: (val) => setState(() => _isBookable = val),
                      activeColor: Theme.of(context).colorScheme.primary,
                      contentPadding: EdgeInsets.zero,
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: _submit,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        isUpdate ? 'Save Changes' : 'Create Asset',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.grey.shade400),
      ),
      validator: validator,
    );
  }

  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required IconData icon,
    required void Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      items: items
          .map((item) => DropdownMenuItem(value: item, child: Text(item)))
          .toList(),
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.grey.shade400),
      ),
    );
  }
}
