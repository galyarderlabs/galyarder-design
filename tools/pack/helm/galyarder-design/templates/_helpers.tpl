{{- /*
Galyarder Design Helm chart helpers. Spec §15.5.

Names:
  galyarder-design.name        chart-name (`galyarder-design`)
  galyarder-design.fullname    release-prefixed name (truncated to 63 chars)
  galyarder-design.labels      common label set
  galyarder-design.selectorLabels   selector subset
*/ -}}

{{- define "galyarder-design.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "galyarder-design.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "galyarder-design.labels" -}}
app.kubernetes.io/name: {{ include "galyarder-design.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end -}}

{{- define "galyarder-design.selectorLabels" -}}
app.kubernetes.io/name: {{ include "galyarder-design.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
