import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Rectangle
import numpy as np

# Create figure with higher DPI for better quality
fig, ax = plt.subplots(figsize=(20, 24), dpi=100)
ax.set_xlim(0, 100)
ax.set_ylim(0, 120)
ax.axis('off')

# Title
ax.text(50, 118, 'AI Governance Navigator - Directory Structure', 
        fontsize=24, fontweight='bold', ha='center')
ax.text(50, 115, 'Complete Project Architecture Overview', 
        fontsize=14, ha='center', color='gray')

# Color scheme
colors = {
    'core': '#4A90E2',      # Blue for core application
    'qa': '#50E3C2',        # Teal for QA
    'agents': '#F5A623',    # Orange for agents
    'config': '#7ED321',    # Green for config
    'docs': '#9013FE',      # Purple for docs
    'db': '#BD10E0',        # Magenta for database
    'test': '#4A90E2'       # Blue for tests
}

# Helper function to draw a box with text
def draw_box(x, y, width, height, text, color, ax, fontsize=10, style='round'):
    if style == 'round':
        box = FancyBboxPatch((x, y), width, height,
                            boxstyle="round,pad=0.1",
                            facecolor=color, edgecolor='black',
                            alpha=0.3, linewidth=1.5)
    else:
        box = Rectangle((x, y), width, height,
                       facecolor=color, edgecolor='black',
                       alpha=0.3, linewidth=1.5)
    ax.add_patch(box)
    
    # Add text with better formatting
    lines = text.split('\n')
    line_height = height / (len(lines) + 1)
    for i, line in enumerate(lines):
        y_pos = y + height - (i + 1) * line_height
        weight = 'bold' if i == 0 else 'normal'
        size = fontsize if i == 0 else fontsize - 1
        ax.text(x + width/2, y_pos, line, 
               fontsize=size, fontweight=weight,
               ha='center', va='center')

# Draw main sections
y_pos = 105

# Root level
draw_box(35, y_pos, 30, 5, 'C:\\code\\AIGovNav\\', colors['config'], ax, 12)
y_pos -= 8

# Core Application Section
draw_box(5, y_pos - 25, 28, 25, '📁 src/\n\nbackend/\n• routes/\n• services/\n• middleware/\n• scripts/\n• data/\n\nfrontend/\n• pages/\n• components/\n• contexts/\n• services/', 
         colors['core'], ax, 11)

# Quality Assurance Section
draw_box(35, y_pos - 25, 28, 25, '📁 qa/\n\nvalidators/\n• EUAIActCompliance\n• LLMGovernance\n• PrismaIntegrity\n\ncategories/\n• security/\n• performance/\n• quality/\n• architecture/\n• testing/', 
         colors['qa'], ax, 11)

# Swarm Agents Section
draw_box(65, y_pos - 25, 28, 25, '🤖 Agents\n\nproduct/\n• user-stories\n• api-specs\n• requirements\n\nengineer/\n• swarm-config\n\ndesigner/\n• swarm-config', 
         colors['agents'], ax, 11)

y_pos -= 30

# Database & Testing
draw_box(5, y_pos - 15, 28, 15, '🗄️ prisma/\n\nschema.prisma\n• AISystem\n• User\n• PolicyPack\n• AuditLog\n• Document', 
         colors['db'], ax, 11)

draw_box(35, y_pos - 15, 28, 15, '🧪 tests/\n\nunit/\n• intake.test.ts\n• riskClassification.test.ts\n\nintegration/\n• auth.test.ts', 
         colors['test'], ax, 11)

# Configuration Files
draw_box(65, y_pos - 15, 28, 15, '⚙️ Config Files\n\n• docker-compose.yml\n• package.json\n• tsconfig.json\n• vite.config.ts\n• vitest.config.ts\n• tailwind.config.js', 
         colors['config'], ax, 11)

y_pos -= 20

# Documentation & Reference
draw_box(5, y_pos - 15, 42, 15, '📚 Reference/\n\nMarket Research/\n• AIGovNav Research docs\n• Images & diagrams\n• Conversion reports\n\nReference Images\n• AI Registry.png\n• dashboard.png\n• swarm diagrams', 
         colors['docs'], ax, 11)

draw_box(50, y_pos - 15, 43, 15, '📝 Documentation\n\n• CLAUDE.md - AI instructions\n• QA_CALIBRATION_SUMMARY.md\n• CTO_DEMO_MATERIALS.md\n• replit-setup-guide.md\n• setup-github.md\n• start-local.md\n• swarm-orchestrator.md', 
         colors['docs'], ax, 11)

y_pos -= 20

# DevOps & CI/CD
draw_box(5, y_pos - 10, 28, 10, '🚀 DevOps\n\n.github/workflows/\n• qa.yml\n\n.claude/\n• settings.local.json', 
         colors['config'], ax, 11)

# Statistics Box
stats_y = y_pos - 10
draw_box(35, stats_y, 58, 10, '', colors['qa'], ax, 11)
ax.text(64, stats_y + 7, '📊 QA Statistics', fontsize=12, fontweight='bold', ha='center')
ax.text(45, stats_y + 4, '147+ Checkpoints', fontsize=10, ha='center')
ax.text(64, stats_y + 4, '8 Validators', fontsize=10, ha='center')
ax.text(83, stats_y + 4, '3 Swarm Agents', fontsize=10, ha='center')
ax.text(45, stats_y + 1.5, '27 EU AI Act', fontsize=10, ha='center')
ax.text(64, stats_y + 1.5, '23 LLM Gov', fontsize=10, ha='center')
ax.text(83, stats_y + 1.5, '14 Prisma', fontsize=10, ha='center')

# Tech Stack Section
tech_y = y_pos - 25
draw_box(5, tech_y, 88, 12, '', colors['core'], ax, 11)
ax.text(49, tech_y + 10, '💻 Technology Stack', fontsize=12, fontweight='bold', ha='center')

# Frontend stack
ax.text(20, tech_y + 7, 'Frontend:', fontsize=10, fontweight='bold')
ax.text(20, tech_y + 5, '• React 18 + TypeScript', fontsize=9)
ax.text(20, tech_y + 3.5, '• Vite + TailwindCSS', fontsize=9)
ax.text(20, tech_y + 2, '• React Router + Zustand', fontsize=9)

# Backend stack
ax.text(49, tech_y + 7, 'Backend:', fontsize=10, fontweight='bold')
ax.text(49, tech_y + 5, '• Node.js + Express', fontsize=9)
ax.text(49, tech_y + 3.5, '• Prisma + PostgreSQL', fontsize=9)
ax.text(49, tech_y + 2, '• Supabase Auth + JWT', fontsize=9)

# DevOps stack
ax.text(78, tech_y + 7, 'DevOps:', fontsize=10, fontweight='bold')
ax.text(78, tech_y + 5, '• Docker + GitHub Actions', fontsize=9)
ax.text(78, tech_y + 3.5, '• Vitest + ESLint', fontsize=9)
ax.text(78, tech_y + 2, '• Context7 Integration', fontsize=9)

# Key Features
features_y = tech_y - 8
draw_box(5, features_y, 88, 6, '', colors['agents'], ax, 11)
ax.text(49, features_y + 4.5, '🎯 Key Features', fontsize=12, fontweight='bold', ha='center')
ax.text(25, features_y + 2, '✓ EU AI Act Compliance Engine', fontsize=9)
ax.text(25, features_y + 0.5, '✓ Real-time LLM/Prompt Monitoring', fontsize=9)
ax.text(68, features_y + 2, '✓ Multi-Agent Swarm Architecture', fontsize=9)
ax.text(68, features_y + 0.5, '✓ Automated Risk Classification', fontsize=9)

# Add connecting lines to show relationships
# Core to QA
ax.plot([19, 35], [y_pos + 10, y_pos + 10], 'k--', alpha=0.3, linewidth=1)
# QA to Tests
ax.plot([49, 49], [y_pos + 5, y_pos - 5], 'k--', alpha=0.3, linewidth=1)
# Agents to Core
ax.plot([65, 33], [y_pos + 10, y_pos + 10], 'k--', alpha=0.3, linewidth=1)

# Add footer
ax.text(50, 2, 'AI Governance Navigator - Enterprise-grade AI Governance Platform', 
        fontsize=10, ha='center', style='italic', color='gray')
ax.text(50, 0.5, 'Compliant with EU AI Act | Real-time Monitoring | Automated Documentation', 
        fontsize=9, ha='center', color='gray')

plt.tight_layout()
plt.savefig('C:\\code\\AIGovNav\\Reference\\directory_structure.png', 
            dpi=150, bbox_inches='tight', facecolor='white', edgecolor='none')
plt.close()

print("Directory structure diagram saved to: C:\\code\\AIGovNav\\Reference\\directory_structure.png")